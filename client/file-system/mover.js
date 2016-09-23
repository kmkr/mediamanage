const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const fileSystemChangeConfirmer = require('./file-system-change-confirmer');
const removeCurrentWdHelper = require('../helpers/remove-current-wd');
const logger = require('../vorpals/logger');
const {cleanFilePath} = require('./renamer-helper');
const indexifyIfExists = require('./indexify-if-exists');

exports.moveAll = ({filePaths, destDirPath, vorpalInstance}) => {
    return Promise.reduce(filePaths, (t, filePath) => {
        const cleanedFilePath = cleanFilePath(filePath);
        const cleanedFileName = path.parse(cleanedFilePath).base;
        return prepareMove(
            filePath,
            path.join(destDirPath, cleanedFileName),
            vorpalInstance
        );
    }, null);
};

function move(sourceFilePath, destFilePath) {
    return new Promise((resolve, reject) => {
        return fs.renameAsync(sourceFilePath, destFilePath)
            .then(resolve)
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
    } catch (e) {
        if (e.code === 'ENOENT') {
            return move(sourceFilePath, destFilePath).then(() => {
                fileSystemChangeConfirmer(sourceFilePath, destFilePath);
            });
        }

        return Promise.reject(e);
    }

    const destinationSize = destinationStats.size;
    const ratio = Math.floor((sourceSize / destinationSize) * 100);
    logger.log(`\nProcessing ${removeCurrentWdHelper(sourceFilePath)}`);

    return vorpalInstance.activeCommand.prompt({
        message: `${destFilePath} exists, what do you want to do? Source size ${sourceSize} vs destination ${destinationSize} (${ratio}%)?`,
        name: 'choice',
        type: 'list',
        choices: ['Indexify', 'Overwrite', 'Skip file']
    }).then(({choice}) => {
        if (choice === 'Indexify') {
            const indexifiedDestFilePath = indexifyIfExists(destFilePath);
            return move(sourceFilePath, indexifiedDestFilePath).then(() => {
                fileSystemChangeConfirmer(sourceFilePath, indexifiedDestFilePath);
            });
        } else if (choice === 'Overwrite') {
            return move(sourceFilePath, destFilePath).then(() => {
                logger.log('Moved from / to (replaced existing file):');
                fileSystemChangeConfirmer(sourceFilePath, destFilePath);
            });
        } else {
            logger.log(`Will not replace ${destFilePath}, continuing ...`);
            return Promise.resolve();
        }
    });
}
