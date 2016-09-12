const Vorpal = require('vorpal');

const fileRenamer = require('../files/renamer');
const config = require('../config.json');

module.exports = function (fileName, onComplete) {
    // todo: play video

    const vorpal = new Vorpal();
    vorpal.delimiter(fileName);

    vorpal
        .command('names [names]', 'Set performer names')
        .action((args, callback) => {
            const performerNames = args.names;
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

    vorpal.command('t', 'Extract ts')
        .action((args, callback) => {
            vorpal.activeCommand.prompt({
                message: 'Start at and ends at in format <performer1<_performer2>><_[category]>@>hh:mm:ss hh:mm:ss (blank to finish)',
                name: 'extractPoint'
            }, function ({extractPoint}) {
                console.log(extractPoint);
                if (extractPoint) {
                    /* todo:
                        find extractor supporting file
                        run extractor
                            parse extract point in extractor
                    */
                } else {
                    callback();
                }
            });
        });

    vorpal.command('n', 'Go back')
        .action((args, callback) => {
            onComplete();
            callback();
        });

    return vorpal;
};
