const rimraf = require('rimraf');

const fileFinder = require('../file-system/finder');

module.exports = vorpalInstance => {
    const rootDir = process.cwd();
    const recursive = true;
    const filePaths = fileFinder.allFiles({ dirPath: rootDir, recursive });
    const videoFileNames = fileFinder.video({ dirPath: rootDir, recursive });
    const audioFileNames = fileFinder.audio({ dirPath: rootDir, recursive });

    filePaths
        .forEach(filePath => vorpalInstance.log(filePath));
    const message = `${filePaths.length} file(s) left (${videoFileNames.length} video, ${audioFileNames.length} audio). Delete?`;

    return vorpalInstance.activeCommand.prompt({
        message,
        name: 'confirmDelete',
        type: 'confirm',
        default: false
    }).then(({ confirmDelete }) => {
        if (confirmDelete) {
            rimraf.sync(rootDir);
            vorpalInstance.log(`Removed ${filePaths.length} file(s) and containing dir`);
        }
    });
};
