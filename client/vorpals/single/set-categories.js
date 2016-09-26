const config = require('../../config.json');
const currentFilePathStore = require('./current-file-path-store');
const fileRenamer = require('../../file-system/renamer');

module.exports = function (vorpal) {
    vorpal
        .command('cat', 'Set categories')
        .action(() => {
            return vorpal.activeCommand.prompt({
                message: 'Enter categories',
                type: 'checkbox',
                name: 'categories',
                choices: config.categories
            }).then(({categories}) => {
                const newPath = fileRenamer.setCategories(categories, currentFilePathStore.get());
                currentFilePathStore.set(newPath);
            });
        });
};
