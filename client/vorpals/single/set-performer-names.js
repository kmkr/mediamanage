const assert = require('assert');
const Promise = require('bluebird');

const currentFilePathStore = require('./current-file-path-store');
const fileRenamer = require('../../file-system/renamer');
const performerNameList = require('../../performers/performer-name-list');

function setPerformerNames(performerNames, filePath) {
    assert(performerNames.constructor === Array, `Names must be an array. Was ${performerNames}`);
    return fileRenamer.setPerformerNames(performerNames, filePath);
}

module.exports = vorpal => {
    vorpal
        .command('names <names...>', 'Set performer names')
        .autocomplete({
            data: performerNameList.list
        })
        .action(({names}) => {
            performerNameList.updateWith(names);
            const newPath = setPerformerNames(names, currentFilePathStore.get());
            currentFilePathStore.set(newPath);
            return Promise.resolve();
        });
};
