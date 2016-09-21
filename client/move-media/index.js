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
            if (!fn) {
                return reject(`No such type ${moveMediaOption.type} - must be either video or audio`);
            }

            let filePaths;

            try {
                filePaths = fn({dirPath: moveMediaOption.fromDir});
            } catch (err) {
                if (err.code === 'ENOENT') {
                    vorpalInstance.log(`Directory ${moveMediaOption.fromDir} not found - continuing`);
                    return resolve();
                }
                return reject(err);
            }

            if (!filePaths.length) {
                vorpalInstance.log(`No ${moveMediaOption.type} files found in ${moveMediaOption.fromDir} - continuing`);
                return resolve();
            }

            filePaths.forEach(filePath => {
                vorpalInstance.log(`Preparing to move ${filePath}`);
            });

            let destinationDirAlternatives;
            try {
                destinationDirAlternatives = fs.readdirSync(moveMediaOption.toDir)
                    .filter(fileNameCandidate => (
                        fs.statSync(path.join(moveMediaOption.toDir, fileNameCandidate)).isDirectory()
                    ));
            } catch (err) {
                if (err.code === 'ENOENT') {
                    vorpalInstance.log(`Unable to move files - ${moveMediaOption.toDir} does not exist!`);
                    return resolve();
                }

                return reject(err);
            }

            if (destinationDirAlternatives.length) {
                vorpalInstance.activeCommand.prompt({
                    message: `Where do you want to move these ${filePaths.length} files?`,
                    name: 'moveDestination',
                    type: 'list',
                    choices: destinationDirAlternatives
                }, function ({moveDestination}) {
                    const destDirPath = path.resolve(moveMediaOption.toDir, moveDestination);
                    resolve(fileMover.moveAll({filePaths, destDirPath, vorpalInstance}));
                });
            } else {
                const destDirPath = path.resolve(moveMediaOption.toDir);
                resolve(fileMover.moveAll({filePaths, destDirPath, vorpalInstance}));
            }

        })
    ), null);
};
