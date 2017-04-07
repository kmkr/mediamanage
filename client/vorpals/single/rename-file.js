const Promise = require('bluebird');
const path = require('path');

const currentFilePathStore = require('./current-file-path-store');
const fileRenamer = require('../../file-system/renamer');
const logger = require('../logger');

module.exports = function (vorpal) {
    vorpal
        .command('rename <newName>', 'Rename file')
        .autocomplete({
            data: () => (
                [
                    path.parse(currentFilePathStore.get()).name
                ]
            )
        })
        .action(args => {
            if (args.newName) {
                const [newPath] = fileRenamer.rename(args.newName, [currentFilePathStore.get()]);
                currentFilePathStore.set(newPath);
            } else {
                logger.log('No rename');
            }
            return Promise.resolve();
        });
};
