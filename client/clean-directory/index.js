const rimraf = require('rimraf');
const Promise = require('bluebird');

const fileFinder = require('../file-system/finder');

module.exports = vorpalInstance => (
    new Promise(resolve => {
        const rootDir = process.cwd();
        const recursive = true;
        const filePaths = fileFinder.allFiles({dirPath: rootDir, recursive});
        const videoFileNames = fileFinder.video({dirPath: rootDir, recursive});
        const audioFileNames = fileFinder.audio({dirPath: rootDir, recursive});

        filePaths
            .forEach(filePath => vorpalInstance.log(filePath));
        const message = `${filePaths.length} file(s) left (${videoFileNames.length} video, ${audioFileNames.length} audio). Delete?`;

        vorpalInstance.activeCommand.prompt({
            message,
            name: 'confirmDelete',
            type: 'confirm',
            default: false
        }, function ({confirmDelete}) {
            if (confirmDelete) {
                rimraf.sync(rootDir);
                vorpalInstance.log(`Removed ${filePaths.length} file(s) and containing dir`);
            }
            return resolve();
        });
    })
);

