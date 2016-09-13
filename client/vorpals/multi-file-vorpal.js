const Vorpal = require('vorpal');

const fileFinder = require('../file-system/finder');
const fileRenamer = require('../file-system/renamer');

module.exports = function (onGoToFile) {
    const vorpal = new Vorpal();
    const fileNames = fileFinder.video();
    fileNames.forEach((fileName, index) => {
        vorpal.log(`${index}) ${fileName}`);
    });
    vorpal.log('Select with s [index]');

    vorpal
        .command('l', 'List media')
        .action((args, callback) => {
            const fileNames = fileFinder.video();
            fileNames.forEach((fileName, index) => {
                vorpal.log(`${index}) ${fileName}`);
            });
            vorpal.log('Select with s [index]');
            callback();
        });

    vorpal
        .command('t <title>', 'Set title')
        .action((args, callback) => {
            fileRenamer.setTitle(args.title, fileFinder.video());
            callback();
        });

    vorpal
        .command('s [index]', 'Select file')
        .action((args, callback) => {
            const fileName = fileFinder.video()[Number(args.index) || 0];
            onGoToFile(fileName);
            callback();
        });

    vorpal.delimiter('mediamanage $');

    return vorpal;
};
