const fs = require('fs');
const path = require('path');
const renamerHelper = require('./renamer-helper');

function rename(sourceFileName, newFileName) {
    const sourceFilePath = path.resolve(process.cwd(), sourceFileName);
    const destFilePath = path.resolve(process.cwd(), newFileName);
    console.log(`Skal rename ${sourceFilePath} til ${destFilePath}`);
    //fs.renameSync(fileNames)
}

exports.setTitle = (title, fileNames) => {
    fileNames.forEach(fileName => {
        const newFileName = renamerHelper.setTitle(title, fileName);
        rename(fileName, newFileName);
    });
};

exports.setPerformerNames = (performerNames, fileName) => {
    const newFileName = renamerHelper.setPerformerNames(performerNames, fileName);
    rename(fileName, newFileName);
};

exports.setCategories = (categories, fileName) => {
    const newFileName = renamerHelper.setCategories(categories, fileName);
    rename(fileName, newFileName);
};
