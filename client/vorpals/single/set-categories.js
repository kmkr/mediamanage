const Promise = require('bluebird');

const config = require('../../config.json');
const currentFilePathStore = require('./current-file-path-store');
const fileRenamer = require('../../file-system/renamer');

module.exports = function (vorpal) {
    vorpal
        .command('cat', 'Set categories')
        .action(() => {
            return new Promise(resolve => {
                vorpal.activeCommand.prompt({
                    message: 'Enter categories',
                    type: 'checkbox',
                    name: 'categories',
                    choices: config.categories
                }, function ({categories}) {
                    const newPath = fileRenamer.setCategories(categories, currentFilePathStore.get());
                    currentFilePathStore.set(newPath);
                    return resolve();
                });
            });
        });
};
