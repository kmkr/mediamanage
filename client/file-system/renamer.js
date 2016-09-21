const assert = require('assert');
const Table = require('cli-table');
const fs = require('fs');
const path = require('path');
const renamerHelper = require('./renamer-helper');
const logger = require('../vorpals/logger');
const removeCurrentWdHelper = require('../helpers/remove-current-wd');

function rename(sourceFilePath, destFileName) {
    const table = new Table({
        head: ['From', 'To'],
        colWidths: [75, 75]
    });
    const destFilePath = path.resolve(destFileName);
    fs.renameSync(sourceFilePath, destFilePath);
    table.push([
        removeCurrentWdHelper(sourceFilePath),
        removeCurrentWdHelper(destFilePath)
    ]);
    logger.log(table.toString());
    return destFilePath;
}

exports.setTitle = (title, filePaths) => {
    filePaths.forEach(filePath => {
        assert(path.isAbsolute(filePath), `File path must be absolute. Was: ${filePath}`);

        const newFileName = renamerHelper.setTitle(title, filePath);
        rename(filePath, newFileName);
    });
};

exports.setPerformerNames = (performerNames, filePath) => {
    assert(path.isAbsolute(filePath), `File path must be absolute. Was: ${filePath}`);

    const newFileName = renamerHelper.setPerformerNames(performerNames, filePath);
    return rename(filePath, newFileName);
};

exports.setCategories = (categories, filePath) => {
    assert(path.isAbsolute(filePath), `File path must be absolute. Was: ${filePath}`);

    const newFileName = renamerHelper.setCategories(categories, filePath);
    return rename(filePath, newFileName);
};
