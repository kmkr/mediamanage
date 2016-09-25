const Promise = require('bluebird');
const chalk = require('vorpal')().chalk;

const currentFilePathStore = require('./current-file-path-store');
const fileRenamer = require('../../file-system/renamer');

module.exports = function (vorpal) {
    vorpal
        .command('title <title>', `Set title ${chalk.bgRed('for single file only')}`)
        .action(args => {
            const newPath = fileRenamer.setTitle(args.title, [currentFilePathStore.get()])[0];

            currentFilePathStore.set(newPath);
            return Promise.resolve();
        });
};
