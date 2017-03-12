const Promise = require('bluebird');

const currentFilePathStore = require('./current-file-path-store');
const fileRenamer = require('../../file-system/renamer');
const keywordsFromCurrentWd = require('../../file-system/keywords-from-current-wd');

module.exports = function (vorpal) {
    vorpal
        .command('title <title...>', 'Set title')
        .autocomplete(keywordsFromCurrentWd())
        .action(args => {
            const title = args.title.join('.');
            const newPath = fileRenamer.setTitle(title, [currentFilePathStore.get()])[0];

            currentFilePathStore.set(newPath);
            return Promise.resolve();
        });
};
