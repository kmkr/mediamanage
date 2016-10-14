const assert = require('assert');
const path = require('path');
const Promise = require('bluebird');

const config = require('../config.json');
const confirmSubDirMover = require('./confirm-sub-dir-mover');
const logger = require('../vorpals/logger');
const fileFinder = require('../file-system/finder');

function resolveToDir(toDir) {
    if (path.isAbsolute(toDir)) {
        return toDir;
    }

    return path.resolve(toDir);
}

exports.all = vorpalInstance => {
    // Include only those media options with fromDir. The others are used for singleFile only.
    const moveMediaOptions = config.moveMediaOptions.filter(moveMediaOption => moveMediaOption.fromDir);

    return Promise.reduce(moveMediaOptions, (t, moveMediaOption) => {
        const fn = fileFinder[moveMediaOption.type];
        if (!fn) {
            throw new Error(`No such type ${moveMediaOption.type} - must be either video or audio`);
        }

        let filePaths;

        try {
            filePaths = fn({ dirPath: moveMediaOption.fromDir });
        } catch (err) {
            if (err.code === 'ENOENT') {
                logger.log(`Directory ${moveMediaOption.fromDir} not found - continuing`);
                return Promise.resolve();
            }
            throw err;
        }

        if (!filePaths.length) {
            logger.log(`No ${moveMediaOption.type} files found in ${moveMediaOption.fromDir} - continuing`);
            return Promise.resolve();
        }

        return confirmSubDirMover({
            filePaths,
            destDirPath: resolveToDir(moveMediaOption.toDir),
            vorpalInstance
        });

    }, null);
};

exports.single = (vorpalInstance, filePath) => {
    assert(path.isAbsolute(filePath), `File path must be absolute. Was ${filePath}`);

    const moveToChoices = config.moveMediaOptions.map(moveMediaOption => resolveToDir(moveMediaOption.toDir));

    return vorpalInstance.activeCommand.prompt({
        message: `Where do you want to move ${filePath}?`,
        name: 'destDirPath',
        type: 'list',
        choices: moveToChoices
    }).then(({ destDirPath }) => {
        if (!destDirPath) {
            return;
        }
        return confirmSubDirMover({
            filePaths: [filePath],
            destDirPath,
            vorpalInstance
        });
    });
};
