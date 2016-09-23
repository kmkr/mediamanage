const Promise = require('bluebird');
const path = require('path');

const config = require('../config');
const touchFile = require('../file-system/toucher');
const fileFinder = require('../file-system/finder');
const {cleanFilePath} = require('../file-system/renamer-helper');

module.exports = vorpalInstance => (
    new Promise((resolve, reject) => {
        const noDownloadPath = config.nodownload.path;
        const reasons = config.nodownload.reasons;

        if (!noDownloadPath || !reasons || !reasons.length) {
            return reject('Missing nodownload config - continuing');
        }

        if (!path.isAbsolute(noDownloadPath)) {
            return reject(`nodownloadpath must be absolute. Was ${noDownloadPath}`);
        }

        const filePaths = fileFinder.video();

        if (!filePaths.length) {
            return reject('No videos found');
        }

        const filePath = filePaths[0];

        vorpalInstance.activeCommand.prompt({
            message: 'Enter reason',
            type: 'list',
            name: 'reason',
            choices: reasons
        }, function ({reason}) {
            const extName = path.parse(filePath).ext;
            const cleanedFileName = cleanFilePath(path.parse(filePath).base);
            const filePathToTouch = `${noDownloadPath}/${cleanedFileName.replace(extName, `_${reason}`)}`;
            touchFile(filePathToTouch);
            resolve();
        });
    })
);
