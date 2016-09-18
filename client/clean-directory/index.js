const rimraf = require('rimraf');
const Promise = require('bluebird');

const fileFinder = require('../file-system/finder');

module.exports = vorpalInstance => (
    new Promise(resolve => {
        const rootDir = process.cwd();
        const recursive = true;
        const filePaths = fileFinder.allFiles(rootDir, recursive);
        const videoFileNames = fileFinder.video(rootDir, recursive);
        const audioFileNames = fileFinder.audio(rootDir, recursive);

        if (!filePaths.length) {
            return resolve();
        }

        filePaths
            .forEach(filePath => vorpalInstance.log(filePath));
        const message = `${filePaths.length} files left (${videoFileNames.length} videos, ${audioFileNames.length} audio). Delete?`;

        vorpalInstance.activeCommand.prompt({
            message,
            name: 'confirmDelete',
            type: 'confirm',
            default: false
        }, function ({confirmDelete}) {
            if (confirmDelete) {
                rimraf.sync(rootDir);
                vorpalInstance.log(`Removed ${filePaths.length} files`);
            }
            return resolve();
        });
    })
);

