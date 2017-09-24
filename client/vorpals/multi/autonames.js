const autonames = require('../../performers/autonames');
const fileFinder = require('../../file-system/finder');
const logger = require('../logger');
const removeCurrentWd = require('../../helpers/remove-current-wd');

module.exports = function (vorpal) {
    vorpal
        .command('autonames', 'Set names based on file title')
        .action(() => {
            const choices = fileFinder.mediaFiles({ recursive: true }).map(filePath => ({
                name: removeCurrentWd(filePath),
                value: filePath,
                checked: true
            }));
            return vorpal.activeCommand.prompt({
                message: 'Select files',
                type: 'checkbox',
                name: 'filePaths',
                choices
            }).then(({ filePaths }) => {
                if (filePaths && filePaths.length) {
                    filePaths.forEach(filePath => {
                        autonames(filePath);
                    })
                } else {
                    logger.log('No file paths set');
                }
            });
        });
};
