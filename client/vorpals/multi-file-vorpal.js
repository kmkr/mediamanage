const Vorpal = require('vorpal');
const chalk = Vorpal().chalk;
const Promise = require('bluebird');

const noDownload = require('../no-download');
const fileFinder = require('../file-system/finder');
const fileRenamer = require('../file-system/renamer');
const moveMedia = require('../move-media/move-media');
const cleanDirectory = require('../clean-directory');
const removeCurrentWdHelper = require('../helpers/remove-current-wd');

const logger = require('./logger');

function logFileNames() {
    const fileNames = fileFinder.mediaFiles({ recursive: true }).map(removeCurrentWdHelper);
    fileNames.forEach((fileName, index) => {
        logger.log(`${index}) ${fileName}`);
    });
    logger.log('Select with s [index]');
}

module.exports = function (onGoToFile) {
    const vorpal = new Vorpal();
    logger.setLogger(vorpal.log.bind(vorpal));
    vorpal.on('client_command_executed', () => {
        logger.log('\n');
    });

    logFileNames();

    vorpal
        .command('l', 'List media')
        .action(() => {
            logFileNames();
            return Promise.resolve();
        });

    vorpal
        .command('title <title>', 'Set title')
        .action(args => {
            fileRenamer.setTitle(args.title, fileFinder.mediaFiles({ recursive: true }));
            return Promise.resolve();
        });

    vorpal
        .command('nodl', 'Add to no download')
        .action(() => {
            return noDownload(vorpal);
        });

    vorpal
        .command('m', 'Move media')
        .action(() => {
            return moveMedia.all(vorpal)
                .then(() => {
                    cleanDirectory(vorpal);
                    process.exit();
                });
        });

    vorpal
        .command('s [index]', 'Select file')
        .action(args => {
            const filePath = fileFinder.mediaFiles({ recursive: true })[Number(args.index) || 0];
            onGoToFile(filePath);
            return Promise.resolve();
        });

    vorpal.delimiter(`${chalk.yellow('mediamanage')} $`);

    return vorpal;
};
