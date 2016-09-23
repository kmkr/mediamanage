const assert = require('assert');
const path = require('path');
const Promise = require('bluebird');

const config = require('../config.json');
const confirmSubDirMover = require('./confirm-sub-dir-mover');
const logger = require('../vorpals/logger');
const fileFinder = require('../file-system/finder');

exports.all = vorpalInstance => {
    // Include only those media options with fromDir. The others are used for singleFile only.
    const moveMediaOptions = config.moveMediaOptions.filter(moveMediaOption => moveMediaOption.fromDir);

    return Promise.reduce(moveMediaOptions, (t, moveMediaOption) => (
        new Promise((resolve, reject) => {
            const fn = fileFinder[moveMediaOption.type];
            if (!fn) {
                return reject(`No such type ${moveMediaOption.type} - must be either video or audio`);
            }

            let filePaths;

            try {
                filePaths = fn({dirPath: moveMediaOption.fromDir});
            } catch (err) {
                if (err.code === 'ENOENT') {
                    logger.log(`Directory ${moveMediaOption.fromDir} not found - continuing`);
                    return resolve();
                }
                return reject(err);
            }

            if (!filePaths.length) {
                logger.log(`No ${moveMediaOption.type} files found in ${moveMediaOption.fromDir} - continuing`);
                return resolve();
            }

            return confirmSubDirMover({
                filePaths,
                destDirPath: moveMediaOption.toDir,
                vorpalInstance
            });

        })
    ), null);
};

exports.single = (vorpalInstance, filePath) => {
    assert(path.isAbsolute(filePath), `File path must be absolute. Was ${filePath}`);

    const moveToChoices = config.moveMediaOptions.map(moveMediaOption => moveMediaOption.toDir);

    return vorpalInstance.activeCommand.prompt({
        message: `Where do you want to move ${filePath}?`,
        name: 'destDirPath',
        type: 'list',
        choices: moveToChoices
    }).then(({destDirPath}) => (
        confirmSubDirMover({
            filePaths: [filePath],
            destDirPath,
            vorpalInstance
        })
    ));
};
