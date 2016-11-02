const Promise = require('bluebird');
const chalk = require('vorpal')().chalk;

const currentFilePathStore = require('./current-file-path-store');
const fileRenamer = require('../../file-system/renamer');
const keywordsFromCurrentWd = require('../../file-system/keywords-from-current-wd');

module.exports = function (vorpal) {
    vorpal
        .command('title <title...>', `Set title ${chalk.bgRed('for single file only')}`)
        .autocomplete(keywordsFromCurrentWd())
        .action(args => {
            const title = args.title.join('.');
            const newPath = fileRenamer.setTitle(title, [currentFilePathStore.get()])[0];

            currentFilePathStore.set(newPath);
            return Promise.resolve();
        });
};
