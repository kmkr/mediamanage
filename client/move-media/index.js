const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const config = require('../config.json');
const fileFinder = require('../file-system/finder');
const fileMover = require('../file-system/mover');

module.exports = vorpalInstance => {
    return Promise.reduce(config.moveMediaOptions, (t, moveMediaOption) => (
        new Promise((resolve, reject) => {
            const fn = fileFinder[moveMediaOption.type];
            let destinationAlternatives, fileNames;

            try {
                fileNames = fn(moveMediaOption.fromDir);
            } catch (err) {
                if (err.code === 'ENOENT') {
                    return resolve();
                }
                return reject(err);
            }

            if (!fileNames.length) {
                vorpalInstance.log(`No files found in ${moveMediaOption.fromDir} - continuing`);
                return resolve();
            }

            try {
                destinationAlternatives = fs.readdirSync(moveMediaOption.toDir);
            } catch (err) {
                if (err.code === 'ENOENT') {
                    vorpalInstance.log(`Unable to move files - ${moveMediaOption.toDir} does not exist!`);
                    return resolve();
                }

                return reject(err);
            }

            if (destinationAlternatives.length) {
                vorpalInstance.activeCommand.prompt({
                    message: `Where do you want to move ${fileNames.join(', ')}`,
                    name: 'moveDestination',
                    type: 'list',
                    choices: destinationAlternatives
                }, function ({moveDestination}) {
                    const sourceDirPath = path.resolve(moveMediaOption.fromDir);
                    const destDirPath = path.resolve(moveMediaOption.toDir, moveDestination);
                    fileMover.moveAll(fileNames, sourceDirPath, destDirPath);
                    return resolve();
                });
            } else {
                const sourceDirPath = path.resolve(moveMediaOption.fromDir);
                const destDirPath = path.resolve(moveMediaOption.toDir);
                fileMover.moveAll(fileNames, sourceDirPath, destDirPath);
                return resolve();
            }

        })
    ), null);
};
