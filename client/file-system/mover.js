const fs = require('fs');
const path = require('path');

const {cleanFileName} = require('./renamer-helper');

exports.moveAll = (fileNames, sourceDirPath, destDirPath) => {
    fileNames.forEach(fileName => {
        const cleanedFileName = cleanFileName(fileName);
        move(path.join(sourceDirPath, fileName), path.join(destDirPath, cleanedFileName));
    });
};

function move(sourceFilePath, destFilePath) {
    if (!path.isAbsolute(sourceFilePath) || !path.extname(sourceFilePath)) {
        throw new Error(`Source file must be an absolute pathed file. Was ${sourceFilePath}`);
    }

    if (!path.isAbsolute(destFilePath) || !path.extname(destFilePath)) {
        throw new Error(`Dest file must be an absolute pathed file. Was ${destFilePath}`);
    }

    // Force throw unless source exists
    fs.statSync(sourceFilePath);

    try {
        fs.statSync(destFilePath);
        throw new Error('todo: Dest file exists - prompt for overwrite');
    } catch (e) {
        if (e.code === 'ENOENT') {
            fs.renameSync(sourceFilePath, destFilePath);
            console.log(`Moved ${sourceFilePath} to ${destFilePath}`);
            return;
        }

        throw e;
    }
}
