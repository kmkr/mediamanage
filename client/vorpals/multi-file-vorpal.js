const Vorpal = require('vorpal');
const chalk = Vorpal().chalk; // eslint-disable-line new-cap
const Promise = require('bluebird');

const noDownload = require('../no-download');
const fileFinder = require('../file-system/finder');
const fileRenamer = require('../file-system/renamer');
const keywordsFromCurrentWd = require('../file-system/keywords-from-current-wd');
const moveMedia = require('../move-media/move-media');
const undoMove = require('../move-media/undo-move');
const cleanDirectory = require('../clean-directory');
const fileNamesLogger = require('./multi/file-names-logger');

const logger = require('./logger');

module.exports = function (onGoToFile) {
    const vorpal = new Vorpal();
    logger.setLogger(vorpal.log.bind(vorpal));
    vorpal.on('client_command_executed', () => {
        logger.log('\n');
    });

    fileNamesLogger();
    logger.log('\n');

    vorpal
        .command('l [filter]', 'List media. Filter is a minimatch pattern. Defaults to "*".')
        .action(({ filter }) => {
            fileNamesLogger(filter);
            return Promise.resolve();
        });

    vorpal
        .command('title <title...>', 'Set title')
        .autocomplete(keywordsFromCurrentWd())
        .action(args => {
            const title = args.title.join('.');
            fileRenamer.setTitle(title, fileFinder.mediaFiles({ recursive: true }));
            return Promise.resolve();
        });

    vorpal
        .command('nodl', 'Add to no download')
        .action(() => {
            const filePaths = fileFinder.video();

            if (!filePaths.length) {
                return Promise.reject('No videos found');
            }

            return noDownload(vorpal, filePaths[0]);
        });

    vorpal
        .command('m', 'Move media')
        .action(() => (
            moveMedia.all(vorpal)
                .then(() => cleanDirectory(vorpal))
        ));

    vorpal
        .command('u', 'Undo move')
        .action(() => (
            undoMove(vorpal)
        ));

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
