const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const {cleanFileName} = require('./renamer-helper');

exports.moveAll = ({filePaths, destDirPath, vorpalInstance}) => {
    return Promise.reduce(filePaths, (t, filePath) => {
        const cleanedFilePath = cleanFileName(filePath);
        const cleanedFileName = path.parse(cleanedFilePath).base;
        return move(
            filePath,
            path.join(destDirPath, cleanedFileName),
            vorpalInstance
        );
    }, null);
};

function move(sourceFilePath, destFilePath, vorpalInstance) {
    return new Promise((resolve, reject) => {
        assert(path.isAbsolute(sourceFilePath) && path.extname(sourceFilePath), `Source file must be an absolute pathed file. Was ${sourceFilePath}`);
        assert(path.isAbsolute(destFilePath) && path.extname(destFilePath), `Dest file must be an absolute pathed file. Was ${sourceFilePath}`);

        // Force throw unless source exists
        const sourceStats = fs.statSync(sourceFilePath);
        const sourceSize = sourceStats.size;

        let destinationStats;

        try {
            destinationStats = fs.statSync(destFilePath);
        } catch (e) {
            if (e.code === 'ENOENT') {
                fs.renameSync(sourceFilePath, destFilePath);
                vorpalInstance.log(`Moved ${sourceFilePath} to ${destFilePath}`);
                return resolve();
            }

            return reject(e);
        }

        const destinationSize = destinationStats.size;
        const ratio = Math.floor((sourceSize / destinationSize) * 100);
        vorpalInstance.activeCommand.prompt({
            message: `${destFilePath} exists, do you want to overwrite? Source size ${sourceSize} vs destination ${destinationSize} (${ratio}%)?`,
            name: 'overwrite',
            type: 'confirm'
        }, ({overwrite}) => {
            if (overwrite) {
                fs.renameSync(sourceFilePath, destFilePath);
                vorpalInstance.log(`Moved ${sourceFilePath} to ${destFilePath} (replaced existing file)`);
            } else {
                vorpalInstance.log(`Will not replace ${destFilePath}, continuing ...`);
            }

            return resolve();
        });
    });
}
