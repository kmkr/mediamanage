const assert = require('assert');
const Vorpal = require('vorpal');
const chalk = Vorpal().chalk;
const path = require('path');

const logger = require('./logger');
const mediaPlayer = require('../media-player');
const moveMedia = require('../move-media/move-media');
const fileRenamer = require('../file-system/renamer');
const {cleanFileName} = require('../file-system/renamer-helper');
const fileDeleter = require('../file-system/deleter');
const performerNameList = require('../performers/performer-name-list');
const removeCurrentWd = require('../helpers/remove-current-wd');
const config = require('../config.json');
const {extractAudio, extractVideo} = require('../media-extract');

function getFormattedFileName(filePath) {
    const fileName = removeCurrentWd(filePath);
    return cleanFileName(fileName).replace(path.parse(fileName).ext, '');
}

function updateFilePath(existingFilePath, newFileName) {
    const existingFileName = removeCurrentWd(existingFilePath);

    return existingFilePath.replace(existingFileName, newFileName);
}

function setPerformerNames(performerNames, filePath) {
    assert(performerNames.constructor === Array, `Names must be an array. Was ${performerNames}`);
    const newPath = fileRenamer.setPerformerNames(performerNames, filePath);
    const newTitle = path.parse(newPath).base;
    return newTitle;
}

module.exports = function (filePath, onComplete) {
    mediaPlayer.play(filePath);
    const vorpal = new Vorpal();

    function setDelimiter() {
        vorpal.delimiter(`${chalk.cyan(getFormattedFileName(filePath))} $`);
    }
    setDelimiter();
    logger.setLogger(vorpal.log.bind(vorpal));

    vorpal
        .command('names <names...>', 'Set performer names')
        .autocomplete({
            data: performerNameList.list
        })
        .action(({names}, callback) => {
            performerNameList.updateWith(names);
            const newTitle = setPerformerNames(names, filePath);
            filePath = updateFilePath(filePath, newTitle);
            setDelimiter();
            logger.log('\n');
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
                setDelimiter();
                logger.log('\n');
                callback();
            });
        });

    config.extractOptions.forEach(({commandKey, destination, type}) => {
        const commandPrompt = `${commandKey} <from> <to> [performerNames...]`;
        vorpal.command(commandPrompt, `Extract to ${destination}`)
            .autocomplete({
                data: performerNameList.list
            })
            .action(({from, to, performerNames}, callback) => {
                const fn = type === 'video' ? extractVideo : extractAudio;
                fn({
                    destinationDir: destination,
                    filePath,
                    from,
                    to
                })
                .then(({destFilePath}) => {
                    logger.log('Extraction complete\n');
                    if (performerNames) {
                        setPerformerNames(performerNames, destFilePath);
                    }
                    callback();
                })
                .catch(err => {
                    logger.log(err);
                });
            });
    });

    vorpal
        .command('m', 'Move file')
        .action((args, callback) => {
            moveMedia.single(vorpal, filePath)
                .then(() => {
                    callback();
                }).catch(err => {
                    logger.log(err);
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
                    onComplete();
                }
                logger.log('\n');
                callback();
            });
        });

    vorpal
        .command('title <title>', `Set title ${chalk.bgRed('for single file only')}`)
        .action((args, callback) => {
            const newTitle = fileRenamer.setTitle(args.title, [filePath])[0];
            filePath = updateFilePath(filePath, newTitle);
            setDelimiter();
            logger.log('\n');
            callback();
        });

    vorpal.command('n', 'Go back')
        .action((args, callback) => {
            mediaPlayer.stop();
            onComplete();
            logger.log('\n');
            callback();
        });

    return vorpal;
};
