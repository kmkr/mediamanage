const Vorpal = require('vorpal');
const chalk = Vorpal().chalk;  // eslint-disable-line new-cap
const path = require('path');
const Promise = require('bluebird');

const logger = require('./logger');

const noDownload = require('../no-download');
const currentFilePathStore = require('./single/current-file-path-store');
const mediaPlayer = require('../media-player');
const moveMedia = require('../move-media/move-media');

const { cleanFilePath } = require('../file-system/renamer-helper');
const fileDeleter = require('../file-system/deleter');

const removeCurrentWd = require('../helpers/remove-current-wd');
const config = require('../config.json');
const searchForExistingMediaService = require('../file-system/search-for-existing-media-service');

function getFormattedFileName(filePath) {
    const fileName = removeCurrentWd(filePath);
    return cleanFilePath(fileName).replace(path.parse(fileName).ext, '');
}

function run(onComplete) {
    const vorpal = new Vorpal();

    function setDelimiter() {
        vorpal.delimiter(`${chalk.cyan(getFormattedFileName(currentFilePathStore.get()))} $`);
    }

    setDelimiter();
    vorpal.on('client_command_executed', ({ command }) => {
        if (command !== 'n' && command !== 'm') {
            setDelimiter();
        }
        logger.log('\n');
    });
    logger.setLogger(vorpal.log.bind(vorpal));

    require('./single/set-performer-names')(vorpal);
    require('./single/set-categories')(vorpal);
    require('./single/set-title')(vorpal);
    require('./single/rename-file')(vorpal);

    config.extractOptions.forEach(extractOption => {
        require('./single/extract')(vorpal, extractOption);
    });

    vorpal
        .command('m', 'Move file')
        .action(() => (
            moveMedia
                .single(vorpal, currentFilePathStore.get())
                .then(onComplete)
        ));

    vorpal.command('d', 'Delete file')
        .action(() => {
            vorpal.activeCommand.prompt({
                message: 'Delete file - are you sure?',
                type: 'confirm',
                name: 'confirmDelete'
            }, function ({ confirmDelete }) {
                if (confirmDelete) {
                    fileDeleter(currentFilePathStore.get());
                }
                onComplete();
                return Promise.resolve();
            });
        });

    vorpal
        .command('nodl', 'Add to no download')
        .action(() => noDownload(vorpal, currentFilePathStore.get()));

    vorpal.command('n', 'Go back')
        .action(() => {
            onComplete();
            return Promise.resolve();
        });

    return vorpal;
}

module.exports = function (filePath, onComplete) {
    currentFilePathStore.set(filePath);
    mediaPlayer.play(currentFilePathStore.get());

    searchForExistingMediaService.byFileName(filePath);

    return run(() => {
        mediaPlayer.stop();
        onComplete();
        currentFilePathStore.unset();
    });
};
