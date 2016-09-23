const assert = require('assert');
const fs = require('fs');
const path = require('path');

const fileSystemChangeConfirmer = require('./file-system-change-confirmer');
const renamerHelper = require('./renamer-helper');

function rename(sourceFilePath, destFileName) {
    const destFilePath = path.resolve(destFileName);
    fs.renameSync(sourceFilePath, destFilePath);
    fileSystemChangeConfirmer(sourceFilePath, destFilePath);
    return destFilePath;
}

exports.setTitle = (title, filePaths) => {
    return filePaths.map(filePath => {
        assert(path.isAbsolute(filePath), `File path must be absolute. Was: ${filePath}`);

        const newFileName = renamerHelper.setTitle(title, filePath);
        return rename(filePath, newFileName);
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
