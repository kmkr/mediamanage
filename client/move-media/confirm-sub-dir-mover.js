const assert = require('assert');
const chalk = require('vorpal')().chalk;
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const logger = require('../vorpals/logger');
const fileMover = require('../file-system/mover');

module.exports = ({filePaths, destDirPath, vorpalInstance}) => {
    return new Promise((resolve, reject) => {
        assert(filePaths && filePaths.constructor === Array, `File paths must be an array. Was ${filePaths}`);

        filePaths.forEach(filePath => {
            logger.log(`Preparing to move ${chalk.yellow(filePath)}`);
        });

        let destinationDirAlternatives;
        try {
            destinationDirAlternatives = fs.readdirSync(destDirPath)
                .filter(fileNameCandidate => (
                    fs.statSync(path.join(destDirPath, fileNameCandidate)).isDirectory()
                ));
        } catch (err) {
            if (err.code === 'ENOENT') {
                logger.log(`Unable to move files - ${destDirPath} does not exist!`);
                return resolve();
            }

            return reject(err);
        }

        if (destinationDirAlternatives.length) {
            vorpalInstance.activeCommand.prompt({
                message: `Where do you want to move ${chalk.yellow(filePaths.length)} files?`,
                name: 'moveDestination',
                type: 'list',
                choices: destinationDirAlternatives
            }, function ({moveDestination}) {
                destDirPath = path.resolve(destDirPath, moveDestination);
                resolve(fileMover.moveAll({filePaths, destDirPath, vorpalInstance}));
            });
        } else {
            destDirPath = path.resolve(destDirPath);
            resolve(fileMover.moveAll({filePaths, destDirPath, vorpalInstance}));
        }

    });
};
