const assert = require('assert');
const chalk = require('vorpal')().chalk;
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const logger = require('../vorpals/logger');
const fileMover = require('../file-system/mover');

module.exports = ({filePaths, destDirPath, vorpalInstance}) => {
    assert(filePaths && filePaths.constructor === Array, `File paths must be an array. Was ${filePaths}`);

    logger.log('\n');
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
            return Promise.resolve();
        }

        return Promise.reject(err);
    }

    if (destinationDirAlternatives.length) {
        // Add root dir as an option
        destinationDirAlternatives.unshift('.');

        return vorpalInstance.activeCommand.prompt({
            message: `Where do you want to move ${chalk.yellow(filePaths.length)} files?`,
            name: 'moveDestination',
            type: 'list',
            choices: destinationDirAlternatives
        }).then(({moveDestination}) => {
            destDirPath = path.resolve(destDirPath, moveDestination);
            return fileMover.moveAll({filePaths, destDirPath, vorpalInstance});
        });
    } else {
        destDirPath = path.resolve(destDirPath);
        return fileMover.moveAll({filePaths, destDirPath, vorpalInstance});
    }

};
