const Vorpal = require('vorpal');

const fileFinder = require('../file-system/finder');
const fileRenamer = require('../file-system/renamer');
const moveMedia = require('../move-media');
const cleanDirectory = require('../clean-directory');
const logger = require('./logger');

function videoFileNamesWithoutPath() {
    return fileFinder.video()
        .map(filePath => filePath.replace(process.cwd(), '.'));
}

function logFileNames() {
    const fileNames = videoFileNamesWithoutPath();
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
            callback();
        });

    vorpal
        .command('t <title>', 'Set title')
        .action((args, callback) => {
            fileRenamer.setTitle(args.title, videoFileNamesWithoutPath());
            callback();
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
            const filePath = fileFinder.video()[Number(args.index) || 0];
            onGoToFile(filePath);
            callback();
        });

    vorpal.delimiter('mediamanage $');

    return vorpal;
};
