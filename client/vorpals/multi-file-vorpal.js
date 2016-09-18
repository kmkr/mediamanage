const Vorpal = require('vorpal');

const fileFinder = require('../file-system/finder');
const fileRenamer = require('../file-system/renamer');
const moveMedia = require('../move-media');
const cleanDirectory = require('../clean-directory');

function videoFileNamesWithoutPath() {
    return fileFinder.video()
        .map(filePath => filePath.replace(process.cwd(), '.'));
}

module.exports = function (onGoToFile) {
    const vorpal = new Vorpal();
    const fileNames = videoFileNamesWithoutPath();
    fileNames.forEach((fileName, index) => {
        vorpal.log(`${index}) ${fileName}`);
    });
    vorpal.log('Select with s [index]');

    vorpal
        .command('l', 'List media')
        .action((args, callback) => {
            const fileNames = videoFileNamesWithoutPath();
            fileNames.forEach((fileName, index) => {
                vorpal.log(`${index}) ${fileName}`);
            });
            vorpal.log('Select with s [index]');
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
                    vorpal.log(err);
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
