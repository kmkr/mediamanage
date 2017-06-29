const assert = require('assert');
const chalk = require('vorpal')().chalk;
const fs = require('fs');
const path = require('path');

const logger = require('../vorpals/logger');
const fileMover = require('./mover');
const promptCreateFolder = require('./prompt-create-folder');
const printPathsService = require('../helpers/print-paths-service');
const removeCurrentWd = require('../helpers/remove-current-wd');

function log(filePaths) {
    logger.log('\nPreparing to move the following files:');
    printPathsService.asList(filePaths.map(entry => removeCurrentWd(entry)));
}

module.exports = ({ filePaths, destDirPath, vorpalInstance }) => {
    assert(filePaths && filePaths.constructor === Array, `File paths must be an array. Was ${filePaths}`);

    log(filePaths);

    return promptCreateFolder(destDirPath, vorpalInstance)
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
                    if (!moveDestination) {
                        return;
                    }
                    destDirPath = path.resolve(destDirPath, moveDestination);
                    return fileMover.moveAll({ filePaths, destDirPath, vorpalInstance });
                });
            } else {
                // Guard while waiting for https://github.com/dthree/vorpal/issues/165
                return vorpalInstance.activeCommand.prompt({
                    message: `Confirm move of ${chalk.yellow(filePaths.length)} files`,
                    name: 'confirmMove',
                    type: 'confirm'
                }).then(({ confirmMove }) => {
                    if (!confirmMove) {
                        return;
                    }

                    destDirPath = path.resolve(destDirPath);
                    return fileMover.moveAll({ filePaths, destDirPath, vorpalInstance });
                });
            }
        });
};
