const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const {cleanFileName} = require('./renamer-helper');

exports.moveAll = ({fileNames, sourceDirPath, destDirPath, vorpalInstance}) => {
    return Promise.reduce(fileNames, (t, fileName) => {
        const cleanedFileName = cleanFileName(fileName);
        return move(
            path.join(sourceDirPath, fileName),
            path.join(destDirPath, cleanedFileName),
            vorpalInstance
        );
    }, null);
};

function move(sourceFilePath, destFilePath, vorpalInstance) {
    return new Promise((resolve, reject) => {
        if (!path.isAbsolute(sourceFilePath) || !path.extname(sourceFilePath)) {
            return reject(`Source file must be an absolute pathed file. Was ${sourceFilePath}`);
        }

        if (!path.isAbsolute(destFilePath) || !path.extname(destFilePath)) {
            return reject(`Dest file must be an absolute pathed file. Was ${destFilePath}`);
        }

        // Force throw unless source exists
        const sourceStats = fs.statSync(sourceFilePath);
        const sourceSize = sourceStats.size;

        try {
            const destinationStats = fs.statSync(destFilePath);
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
        } catch (e) {
            if (e.code === 'ENOENT') {
                fs.renameSync(sourceFilePath, destFilePath);
                vorpalInstance.log(`Moved ${sourceFilePath} to ${destFilePath}`);
                return resolve();
            }

            return reject(e);
        }
    });
}
