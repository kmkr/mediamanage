const fs = require('fs');
const path = require('path');
const renamerHelper = require('./renamer-helper');

function rename(sourceFileName, newFileName) {
    const sourceFilePath = path.resolve(process.cwd(), sourceFileName);
    const destFilePath = path.resolve(process.cwd(), newFileName);
    fs.renameSync(sourceFilePath, destFilePath);
    console.log(`Renamed ${sourceFilePath} to ${destFilePath}`);
    return newFileName;
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
