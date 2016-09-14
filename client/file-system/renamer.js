const fs = require('fs');
const path = require('path');
const renamerHelper = require('./renamer-helper');

function rename(sourceFileName, destFileName) {
    const sourceFilePath = path.resolve(sourceFileName);
    const destFilePath = path.resolve(destFileName);
    fs.renameSync(sourceFilePath, destFilePath);
    console.log(`Renamed ${sourceFilePath} to ${destFilePath}`);
    return destFileName;
}

exports.setTitle = (title, fileNames) => {
    fileNames.forEach(fileName => {
        const newFileName = renamerHelper.setTitle(title, fileName);
        rename(fileName, newFileName);
    });
};

exports.setPerformerNames = (performerNames, fileName) => {
    const newFileName = renamerHelper.setPerformerNames(performerNames, fileName);
    return rename(fileName, newFileName);
};

exports.setCategories = (categories, fileName) => {
    const newFileName = renamerHelper.setCategories(categories, fileName);
    return rename(fileName, newFileName);
};
