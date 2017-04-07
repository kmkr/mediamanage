const assert = require('assert');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const fileSystemChangeConfirmer = require('./file-system-change-confirmer');
const renamerHelper = require('./renamer-helper');
const indexifyIfExists = require('./indexify-if-exists');

function rename(sourceFilePath, destFileName) {
    const destFilePath = indexifyIfExists(
        path.resolve(destFileName)
    );
    fs.renameSync(sourceFilePath, destFilePath);
    fileSystemChangeConfirmer(sourceFilePath, destFilePath);
    return destFilePath;
}

exports.rename = (newFileName, filePath) => {
    assert(path.isAbsolute(filePath), `File path must be absolute. Was: ${filePath}`);
    assert(newFileName, `File name must be set. Was: ${newFileName}`);

    const sourceFilePath = filePath;
    const currentFileName = path.parse(sourceFilePath).name;
    const destFilePath = sourceFilePath.replace(currentFileName, newFileName);

    // todo: confirm hvis filePaths er flere enn en, eventuelt innfør en "undo"
    return rename(sourceFilePath, destFilePath);
};

exports.setTitle = (title, filePaths) => {
    return filePaths.map(filePath => {
        const newFileName = renamerHelper.setTitle(title, filePath);
        return rename(filePath, newFileName);
    });
};

exports.setPerformerNames = (performerNames, filePaths) => {
    assert(Array.isArray(performerNames), `Names must be an array. Was ${performerNames}`);
    assert(Array.isArray(filePaths), `File paths must be an array. Was ${filePaths}`);

    return filePaths.map(filePath => {
        const newFileName = renamerHelper.setPerformerNames(performerNames, filePath);
        return rename(filePath, newFileName);
    });
};

exports.setCategories = (categories, filePaths) => {
    assert(Array.isArray(categories), `Categories must be an array. Was ${categories}`);
    assert(Array.isArray(filePaths), `File paths must be an array. Was ${filePaths}`);

    return filePaths.map(filePath => {
        const sortedCategories = config.categories.filter(category => categories.includes(category));
        const newFileName = renamerHelper.setCategories(sortedCategories, filePath);
        return rename(filePath, newFileName);
    });
};
