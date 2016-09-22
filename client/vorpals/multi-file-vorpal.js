const Vorpal = require('vorpal');
const chalk = Vorpal().chalk;

const noDownload = require('../no-download');
const fileFinder = require('../file-system/finder');
const fileRenamer = require('../file-system/renamer');
const moveMedia = require('../move-media');
const cleanDirectory = require('../clean-directory');
const removeCurrentWdHelper = require('../helpers/remove-current-wd');

const logger = require('./logger');

function logFileNames() {
    const fileNames = fileFinder.mediaFiles({recursive: true}).map(removeCurrentWdHelper);
    fileNames.forEach((fileName, index) => {
        logger.log(`${index}) ${fileName}`);
    });
    logger.log('Select with s [index]');
}

module.exports = function (onGoToFile) {
    const vorpal = new Vorpal();
    logger.setLogger(vorpal.log.bind(vorpal));

    logFileNames();

    vorpal
        .command('l', 'List media')
        .action((args, callback) => {
            logFileNames();
            logger.log('\n');
            callback();
        });

    vorpal
        .command('t <title>', 'Set title')
        .action((args, callback) => {
            fileRenamer.setTitle(args.title, fileFinder.mediaFiles({recursive: true}));
            logger.log('\n');
            callback();
        });

    vorpal
        .command('nodl', 'Add to no download')
        .action((args, callback) => {
            noDownload(vorpal).then(callback);
        });

    vorpal
        .command('m', 'Move media')
        .action((args, callback) => {
            moveMedia(vorpal)
                .then(() => (
                    cleanDirectory(vorpal)
                ))
                .then(() => {
                    callback();
                    process.exit();
                }).catch(err => {
                    logger.log(err);
                });
        });

    vorpal
        .command('s [index]', 'Select file')
        .action((args, callback) => {
            const filePath = fileFinder.mediaFiles({recursive: true})[Number(args.index) || 0];
            onGoToFile(filePath);
            logger.log('\n');
            callback();
        });

    vorpal.delimiter(`${chalk.yellow('mediamanage')} $`);

    return vorpal;
};
