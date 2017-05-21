const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const printSourceDestService = require('../helpers/print-source-dest-service');
const removeCurrentWdHelper = require('../helpers/remove-current-wd');
const logger = require('../vorpals/logger');
const { cleanFilePath } = require('../file-system/renamer-helper');
const indexifyIfExists = require('../file-system/indexify-if-exists');
const movedFiles = require('../file-system/moved-files-service');

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
    logger.log(`\nProcessing ${removeCurrentWdHelper(sourceFilePath)}`);
    logger.log(`${destFilePath} exists, what do you want to do?`);
    logger.log(`Src: ${sourceSize}B, modified ${sourceStats.mtime}, created ${sourceStats.birthtime}.`);
    logger.log(`Dst: ${destinationSize}B, modified ${destinationStats.mtime}, created ${destinationStats.birthtime}`);
    logger.log(`Source is ${ratio} of the destination size.`);

    return vorpalInstance.activeCommand.prompt({
        message: 'What do you want to do?',
        type: 'list',
        name: 'choice',
        choices: ['Indexify', 'Overwrite', 'Skip file']
    }).then(({ choice }) => {
        if (choice === 'Indexify') {
            const indexifiedDestFilePath = indexifyIfExists(destFilePath);
            return move(sourceFilePath, indexifiedDestFilePath).then(() => {
                printSourceDestService({
                    sourceFilePaths: [sourceFilePath],
                    destFilePaths: [destFilePath]
                });
            });
        } else if (choice === 'Overwrite') {
            return move(sourceFilePath, destFilePath).then(() => {
                logger.log('Moved from / to (replaced existing file):');
                printSourceDestService({
                    sourceFilePaths: [sourceFilePath],
                    destFilePaths: [destFilePath]
                });
            });
        } else {
            logger.log(`Will not replace ${destFilePath}, continuing ...`);
            return Promise.resolve();
        }
    });
}
