const chalk = require('vorpal')().chalk;
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const printSourceDestService = require('../helpers/print-source-dest-service');
const logger = require('../vorpals/logger');
const { cleanFilePath } = require('../file-system/renamer-helper');
const indexifyIfExists = require('../file-system/indexify-if-exists');
const movedFiles = require('../file-system/moved-files-service');
const fileDeleter = require('../file-system/deleter');

exports.moveAll = ({ filePaths, destDirPath, destDirPaths, vorpalInstance }) => {
    return Promise.reduce(filePaths, (t, filePath, index) => {
        let destFilePath;
        if (destDirPath) {
            const cleanedFilePath = cleanFilePath(filePath);
            const cleanedFileName = path.parse(cleanedFilePath).base;
            destFilePath = path.join(destDirPath, cleanedFileName);
        } else {
            destFilePath = destDirPaths[index];
        }

        return prepareMove(
            filePath,
            destFilePath,
            vorpalInstance
        );
    }, null);
};

function move(sourceFilePath, destFilePath) {
    return new Promise((resolve, reject) => {
        return fs.renameAsync(sourceFilePath, destFilePath)
            .catch(e => {
                if (e.code === 'EXDEV') {
                    let size = fs.statSync(sourceFilePath).size;
                    if (size <= 1024) {
                        size = `${Math.floor(size / 1024)}k`;
                    } else if (size < (1024 * 1024)) {
                        size = `${Math.floor(size / 1024 / 1024)}m`;
                    }
                    logger.log(`Moving ${size} cross-device`);
                    const is = fs.createReadStream(sourceFilePath);
                    const os = fs.createWriteStream(destFilePath);

                    is.pipe(os);
                    is.on('end', function () {
                        fs.unlinkSync(sourceFilePath);
                        return resolve();
                    });
                } else {
                    return reject(e);
                }
            })
            .then(() => {
                movedFiles.add({ sourceFilePath, destFilePath });
                resolve();
            });
    });
}

function shouldAutoIndexify(sourceStats, destinationStats) {
    const oneHourInMilliseconds = 60 * 60 * 1000;
    return Math.abs(sourceStats.mtime.getTime() - destinationStats.mtime.getTime()) < oneHourInMilliseconds;
}

function indexify(sourceFilePath, destFilePath) {
    const indexifiedDestFilePath = indexifyIfExists(destFilePath);
    return move(sourceFilePath, indexifiedDestFilePath).then(() => {
        printSourceDestService({
            sourceFilePaths: [sourceFilePath],
            destFilePaths: [indexifiedDestFilePath]
        });
    });
}

function prepareMove(sourceFilePath, destFilePath, vorpalInstance) {
    assert(path.isAbsolute(sourceFilePath) && path.extname(sourceFilePath), `Source file must be an absolute pathed file. Was ${sourceFilePath}`);
    assert(path.isAbsolute(destFilePath) && path.extname(destFilePath), `Dest file must be an absolute pathed file. Was ${destFilePath}`);

    // Force throw unless source exists
    const sourceStats = fs.statSync(sourceFilePath);
    const sourceSize = sourceStats.size;

    let destinationStats;

    try {
        destinationStats = fs.statSync(destFilePath);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return move(sourceFilePath, destFilePath).then(() => {
                printSourceDestService({
                    sourceFilePaths: [sourceFilePath],
                    destFilePaths: [destFilePath]
                });
            });
        }

        throw err;
    }

    const destinationSize = destinationStats.size;
    const ratio = sourceSize / destinationSize;

    const autoIndexify = shouldAutoIndexify(sourceStats, destinationStats);

    if (autoIndexify) {
        return indexify(sourceFilePath, destFilePath);
    }

    logger.log(`${chalk.yellow(destFilePath)} exists, what do you want to do?`);
    logger.log(`Src: Modified ${chalk.bold(sourceStats.mtime)}, created ${chalk.bold(sourceStats.birthtime)}, ${chalk.bold(sourceSize)}B`);
    logger.log(`Dst: Modified ${chalk.bold(destinationStats.mtime)}, created ${chalk.bold(destinationStats.birthtime)}, ${chalk.bold(destinationSize)}B`);
    logger.log(`Source is ${chalk.bold(Math.round(ratio * 100) / 100)} times the destination size.`);

    return vorpalInstance.activeCommand.prompt({
        message: 'What do you want to do?',
        type: 'list',
        name: 'choice',
        choices: ['Indexify', 'Overwrite', 'Skip file', 'Delete file']
    }).then(({ choice }) => {
        switch (choice) {
        case 'Indexify':
            return indexify(sourceFilePath, destFilePath);
        case 'Overwrite':
            return move(sourceFilePath, destFilePath).then(() => {
                logger.log('Moved from / to (replaced existing file):');
                printSourceDestService({
                    sourceFilePaths: [sourceFilePath],
                    destFilePaths: [destFilePath]
                });
            });
        case 'Delete file':
            return fileDeleter(sourceFilePath);
        default:
            logger.log(`Will not replace ${destFilePath}, continuing ...`);
            return Promise.resolve();
        }
    });
}
