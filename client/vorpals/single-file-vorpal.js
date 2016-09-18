const Vorpal = require('vorpal');
const path = require('path');

const logger = require('./logger');
const mediaPlayer = require('../media-player');
const fileRenamer = require('../file-system/renamer');
const performerNameCleaner = require('../performers/name-cleaner');
const config = require('../config.json');
const {extractFormat, extractFormatValidator, extractAudio, extractVideo} = require('../media-extract');

module.exports = function (filePath, onComplete) {
    let fileName = path.parse(filePath).base;

    mediaPlayer.play(filePath);

    const vorpal = new Vorpal();
    logger.setLogger(vorpal.log.bind(vorpal));
    vorpal.delimiter(fileName);

    vorpal
        .command('names <names...>', 'Set performer names')
        .autocomplete(config.autocomplete.performerNames)
        .action((args, callback) => {
            const joinedNames = args.names.join('_');
            const performerNames = performerNameCleaner(joinedNames);
            const newPath = fileRenamer.setPerformerNames(performerNames, fileName);
            const newTitle = path.parse(newPath).base;
            fileName = newTitle;
            vorpal.delimiter(fileName);
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
                const newPath = fileRenamer.setCategories(categories, fileName);
                const newTitle = path.parse(newPath).base;
                fileName = newTitle;
                vorpal.delimiter(fileName);
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

    vorpal.command('n', 'Go back')
        .action((args, callback) => {
            mediaPlayer.stop();
            onComplete();
            callback();
        });

    return vorpal;
};
