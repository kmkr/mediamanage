const Vorpal = require('vorpal');
const path = require('path');

const logger = require('./logger');
const mediaPlayer = require('../media-player');
const fileRenamer = require('../file-system/renamer');
const {cleanFileName} = require('../file-system/renamer-helper');
const fileDeleter = require('../file-system/deleter');
const performerNameCleaner = require('../performers/name-cleaner');
const performerNameList = require('../performers/performer-name-list');
const removeCurrentWd = require('../helpers/remove-current-wd');
const config = require('../config.json');
const {extractFormat, extractFormatValidator, extractAudio, extractVideo} = require('../media-extract');

function getFormattedFileName(filePath) {
    const fileName = removeCurrentWd(filePath);
    return cleanFileName(fileName).replace(path.parse(fileName).ext, '');
}

function updateFilePath(existingFilePath, newFileName) {
    const existingFileName = removeCurrentWd(existingFilePath);

    return existingFilePath.replace(existingFileName, newFileName);
}

module.exports = function (filePath, onComplete) {

    mediaPlayer.play(filePath);

    const vorpal = new Vorpal();
    logger.setLogger(vorpal.log.bind(vorpal));
    vorpal.delimiter(getFormattedFileName(filePath));

    vorpal
        .command('names <names...>', 'Set performer names')
        .autocomplete({
            data: performerNameList.list
        })
        .action(({names}, callback) => {
            performerNameList.updateWith(names);
            const joinedNames = names.join('_');
            const performerNames = performerNameCleaner(joinedNames);
            const newPath = fileRenamer.setPerformerNames(performerNames, filePath);
            const newTitle = path.parse(newPath).base;
            filePath = updateFilePath(filePath, newTitle);
            vorpal.delimiter(getFormattedFileName(filePath));
            callback();
        });

    vorpal.command('cat', 'Set categories')
        .action((args, callback) => {
            vorpal.activeCommand.prompt({
                message: 'Enter categories',
                type: 'checkbox',
                name: 'categories',
                choices: config.categories
            }, function ({categories}) {
                const newPath = fileRenamer.setCategories(categories, filePath);
                const newTitle = path.parse(newPath).base;
                filePath = updateFilePath(filePath, newTitle);
                vorpal.delimiter(getFormattedFileName(filePath));
                callback();
            });
        });

    config.extractOptions.forEach(({commandKey, destination, type}) => {
        vorpal.command(commandKey, `Extract to ${destination}`)
            .action((args, callback) => {
                vorpal.activeCommand.prompt({
                    message: `${extractFormat} (blank to finish) `,
                    name: 'extractPoint',
                    validate: extractFormatValidator
                }, function ({extractPoint}) {
                    if (extractPoint) {
                        const fn = type === 'video' ? extractVideo : extractAudio;
                        fn({
                            destinationDir: destination,
                            filePath,
                            extractPoint
                        })
                        .then(callback)
                        .catch(err => {
                            logger.log(err);
                        });
                    }
                });
            });
    });

    vorpal.command('d', 'Delete file')
        .action((args, callback) => {
            vorpal.activeCommand.prompt({
                message: 'Delete file - are you sure?',
                type: 'confirm',
                name: 'confirmDelete'
            }, function ({confirmDelete}) {
                if (confirmDelete) {
                    fileDeleter(filePath);
                }
                callback();
            });
        });

    vorpal.command('n', 'Go back')
        .action((args, callback) => {
            mediaPlayer.stop();
            onComplete();
            callback();
        });

    return vorpal;
};
