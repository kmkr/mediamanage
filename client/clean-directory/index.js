const rimraf = require('rimraf');
const chalk = require('chalk');

const fileFinder = require('../file-system/finder');
const logger = require('../vorpals/logger');

function clean(rootDir) {
    rimraf.sync(rootDir);
}

module.exports = vorpalInstance => {
    const rootDir = process.cwd();
    const recursive = true;
    const filePaths = fileFinder.allFiles({ dirPath: rootDir, recursive });
    const videoFileNames = fileFinder.video({ dirPath: rootDir, recursive });
    const audioFileNames = fileFinder.audio({ dirPath: rootDir, recursive });

    filePaths
        .forEach(filePath => logger.log(filePath));

    if (filePaths.length === 0) {
        logger.log(`Removing ${chalk.red(rootDir)}`);
        clean(rootDir);
        return Promise.resolve();
    }

    const message = `${chalk.bold(filePaths.length)} file(s) left (${chalk.bold(videoFileNames.length)} video, ${chalk.bold(audioFileNames.length)} audio). Delete?`;

    return vorpalInstance.activeCommand.prompt({
        message,
        name: 'confirmDelete',
        type: 'confirm',
        default: false
    }).then(({ confirmDelete }) => {
        if (!confirmDelete) {
            return;
        }

        clean(rootDir, filePaths);
        logger.log(`Removed ${chalk.bold(filePaths.length)} file(s) and containing dir`);
    });
};
