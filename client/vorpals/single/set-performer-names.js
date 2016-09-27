const Promise = require('bluebird');

const config = require('../../config.json');
const currentFilePathStore = require('./current-file-path-store');
const performerNameList = require('../../performers/performer-name-list');
const categoriesAndPerformerNamesHandler = require('./categories-and-performer-name-handler')

module.exports = vorpal => {
    vorpal
        .command('names <names...>', 'Set performer names (and/or categories)')
        .autocomplete({
            data: () => config.categories.concat(performerNameList.list())
        })
        .action(({names}) => {
            const performerNamesAndCategories = names;
            const newPath = categoriesAndPerformerNamesHandler(performerNamesAndCategories, currentFilePathStore.get());
            currentFilePathStore.set(newPath);
            return Promise.resolve();
        });
};
