const assert = require('assert');
const fs = require('fs');
const path = require('path');
const renamerHelper = require('./renamer-helper');
const logger = require('../vorpals/logger');

function rename(sourceFilePath, destFileName) {
    const destFilePath = path.resolve(destFileName);
    fs.renameSync(sourceFilePath, destFilePath);
    logger.log('Renamed from / to');
    logger.log(sourceFilePath.replace(process.cwd(), ''));
    logger.log(destFilePath.replace(process.cwd(), ''));
    return destFilePath;
}

exports.setTitle = (title, filePaths) => {
    filePaths.forEach(fileName => {
        assert(!path.isAbsolute(fileName), `File path cannot be absolute. Was: ${fileName}`);

        const newFileName = renamerHelper.setTitle(title, fileName);
        rename(fileName, newFileName);
    });
};

exports.setPerformerNames = (performerNames, fileName) => {
    assert(!path.isAbsolute(fileName), `File path cannot be absolute. Was: ${fileName}`);

    const newFileName = renamerHelper.setPerformerNames(performerNames, fileName);
    return rename(fileName, newFileName);
};

exports.setCategories = (categories, fileName) => {
    assert(!path.isAbsolute(fileName), `File path cannot be absolute. Was: ${fileName}`);

    const newFileName = renamerHelper.setCategories(categories, fileName);
    return rename(fileName, newFileName);
};
