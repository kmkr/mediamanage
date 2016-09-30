const assert = require('assert');
const chalk = require('vorpal')().chalk;
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const logger = require('../vorpals/logger');
const fileMover = require('../file-system/mover');

function log(filePaths) {
    logger.log('\n');
    filePaths.forEach(filePath => {
        logger.log(`Preparing to move ${chalk.yellow(filePath)}`);
    });
}

module.exports = ({ filePaths, destDirPath, vorpalInstance }) => {
    assert(filePaths && filePaths.constructor === Array, `File paths must be an array. Was ${filePaths}`);

    log(filePaths);

    return fs.readdirAsync(destDirPath).catch(err => {
        if (err.code === 'ENOENT') {
            return vorpalInstance.activeCommand.prompt({
                message: `${chalk.yellow(destDirPath)} does not exist, do you want to create it?`,
                name: 'create',
                type: 'confirm'
            }).then(({ create }) => {
                if (create) {
                    return mkdirp.mkdirpAsync(destDirPath)
                        .then(() => []);
                } else {
                    logger.log(`Won't create ${destDirPath} - continuing`);
                    return [];
                }
            });
        } else {
            throw err;
        }
    })
    .then(fileNameCandidates => (
        fileNameCandidates.filter(fileNameCandidate => (
            fs.statSync(path.join(destDirPath, fileNameCandidate)).isDirectory()
        ))
    ))
    .then(destinationDirAlternatives => {
        if (destinationDirAlternatives.length) {
            // Add root dir as an option
            destinationDirAlternatives.unshift('.');

            return vorpalInstance.activeCommand.prompt({
                message: `Where do you want to move ${chalk.yellow(filePaths.length)} files?`,
                name: 'moveDestination',
                type: 'list',
                choices: destinationDirAlternatives
            }).then(({ moveDestination }) => {
                destDirPath = path.resolve(destDirPath, moveDestination);
                return fileMover.moveAll({ filePaths, destDirPath, vorpalInstance });
            });
        } else {
            destDirPath = path.resolve(destDirPath);
            return fileMover.moveAll({ filePaths, destDirPath, vorpalInstance });
        }
    });
};
