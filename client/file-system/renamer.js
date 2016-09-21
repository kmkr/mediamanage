const assert = require('assert');
const chalk = require('vorpal')().chalk;
const fs = require('fs');
const path = require('path');
const renamerHelper = require('./renamer-helper');
const logger = require('../vorpals/logger');
const removeCurrentWdHelper = require('../helpers/remove-current-wd');

function rename(sourceFilePath, destFileName) {
    const destFilePath = path.resolve(destFileName);
    fs.renameSync(sourceFilePath, destFilePath);
    logger.log('Renamed from / to:');
    logger.log(chalk.bgRed(removeCurrentWdHelper(sourceFilePath)));
    logger.log(chalk.bgGreen(removeCurrentWdHelper(destFilePath)));
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
