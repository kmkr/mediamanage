const Vorpal = require('vorpal');

const mediaPlayer = require('../media-player');
const fileRenamer = require('../file-system/renamer');
const performerNameCleaner = require('../performers/name-cleaner');
const config = require('../config.json');
const {extractFormat, extractFormatValidator, extractAudio, extractVideo} = require('../media-extract');

module.exports = function (fileName, onComplete) {
    mediaPlayer.play(process.cwd(), fileName);

    const vorpal = new Vorpal();
    vorpal.delimiter(fileName);

    vorpal
        .command('names <names...>', 'Set performer names')
        .autocomplete(config.autocomplete.performerNames)
        .action((args, callback) => {
            const joinedNames = args.names.join('_');
            const performerNames = performerNameCleaner(joinedNames);
            const newTitle = fileRenamer.setPerformerNames(performerNames, fileName);
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
                const newTitle = fileRenamer.setCategories(categories, fileName);
                fileName = newTitle;
                vorpal.delimiter(fileName);
                callback();
            });
        });

    config.extractOptions.forEach(({commandKey, destination, type}) => {
        vorpal.command(commandKey, `Extract to ${destination}`)
            .action((args, callback) => {
                vorpal.activeCommand.prompt({
                    message: `${extractFormat} (blank to finish)`,
                    name: 'extractPoint',
                    validate: extractFormatValidator
                }, function ({extractPoint}) {
                    if (extractPoint) {
                        const fn = type === 'video' ? extractVideo : extractAudio;
                        fn({
                            destinationDir: destination,
                            fileName,
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
