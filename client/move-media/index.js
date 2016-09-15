const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const config = require('../config.json');
const fileFinder = require('../file-system/finder');
const fileMover = require('../file-system/mover');

module.exports = vorpalInstance => {
    return Promise.reduce(config.moveMediaOptions, (t, moveMediaOption) => (
        new Promise((resolve, reject) => {
            console.log(`Inne i move media promise ${t} ${moveMediaOption}`);
            const fn = fileFinder[moveMediaOption.type];
            if (!fn) {
                return reject(`No such type ${moveMediaOption.type} - must be either video or audio`);
            }

            let fileNames;

            try {
                fileNames = fn(moveMediaOption.fromDir);
            } catch (err) {
                if (err.code === 'ENOENT') {
                    vorpalInstance.log(`Directory ${moveMediaOption.fromDir} not found - continuing`);
                    return resolve();
                }
                return reject(err);
            }

            if (!fileNames.length) {
                vorpalInstance.log(`No files found in ${moveMediaOption.fromDir} - continuing`);
                return resolve();
            }

            let destinationDirAlternatives;
            try {
                destinationDirAlternatives = fs.readdirSync(moveMediaOption.toDir)
                    .filter(file => (
                        fs.statSync(path.join(moveMediaOption.toDir, file)).isDirectory()
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
                    message: `Where do you want to move ${fileNames.join(', ')}`,
                    name: 'moveDestination',
                    type: 'list',
                    choices: destinationDirAlternatives
                }, function ({moveDestination}) {
                    const sourceDirPath = path.resolve(moveMediaOption.fromDir);
                    const destDirPath = path.resolve(moveMediaOption.toDir, moveDestination);
                    resolve(fileMover.moveAll({fileNames, sourceDirPath, destDirPath, vorpalInstance}));
                });
            } else {
                const sourceDirPath = path.resolve(moveMediaOption.fromDir);
                const destDirPath = path.resolve(moveMediaOption.toDir);
                resolve(fileMover.moveAll({fileNames, sourceDirPath, destDirPath, vorpalInstance}));
            }

        })
    ), null);
};
