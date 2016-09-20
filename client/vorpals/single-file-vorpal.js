const Vorpal = require('vorpal');
const path = require('path');

const logger = require('./logger');
const mediaPlayer = require('../media-player');
const fileRenamer = require('../file-system/renamer');
const {cleanFileName} = require('../file-system/renamer-helper');
const fileDeleter = require('../file-system/deleter');
const performerNameCleaner = require('../performers/name-cleaner');
const config = require('../config.json');
const {extractFormat, extractFormatValidator, extractAudio, extractVideo} = require('../media-extract');

function getFileName(filePath) {
    return path.parse(filePath).base;
}

function getFormattedFileName(filePath) {
    const fileName = getFileName(filePath);
    return cleanFileName(fileName).replace(path.parse(fileName).ext, '');
}

function updateFilePath(existingFilePath, newFileName) {
    const existingFileName = getFileName(existingFilePath);

    return existingFilePath.replace(existingFileName, newFileName);
}

module.exports = function (filePath, onComplete) {

    mediaPlayer.play(filePath);

    const vorpal = new Vorpal();
    logger.setLogger(vorpal.log.bind(vorpal));
    vorpal.delimiter(getFileName(filePath));

    vorpal
        .command('names <names...>', 'Set performer names')
        .autocomplete(config.autocomplete.performerNames)
        .action((args, callback) => {
            const joinedNames = args.names.join('_');
            const performerNames = performerNameCleaner(joinedNames);
            const newPath = fileRenamer.setPerformerNames(performerNames, getFileName(filePath));
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
                const newPath = fileRenamer.setCategories(categories, getFileName(filePath));
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
                        });
                    }
                    callback();
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
