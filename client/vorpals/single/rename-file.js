const Promise = require('bluebird');

const currentFilePathStore = require('./current-file-path-store');
const fileRenamer = require('../../file-system/renamer');
const logger = require('../logger');

module.exports = function (vorpal) {
    vorpal
        .command('rename <newName>', 'Rename file')
        .action(args => {
            if (args.newName) {
                const newPath = fileRenamer.rename(args.newName, currentFilePathStore.get());
                currentFilePathStore.set(newPath);
            } else {
                logger.log('No rename');
            }
            return Promise.resolve();
        });
};
