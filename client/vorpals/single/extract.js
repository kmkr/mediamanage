const config = require('../../config.json');
const currentFilePathStore = require('./current-file-path-store');
const { extractAudio, extractVideo, validate } = require('../../media-extract');
const logger = require('../logger');
const performerNameList = require('../../performers/performer-name-list');
const categoriesAndPerformerNamesHandler = require('./categories-and-performer-names-handler');

module.exports = (vorpal, extractOption) => {
    const { commandKey, destination, type } = extractOption;
    const commandPrompt = `${commandKey} <from> <to> [performerNamesAndCategories...]`;

    vorpal
        .command(commandPrompt, `Extract to ${destination}`)
        .validate(({ from, to, performerNames }) => {
            const isValid = validate({ from, to, performerNames });
            if (!isValid) {
                logger.log('Invalid input');
            }
            return isValid;
        })
        .autocomplete({
            data: () => config.categories.concat(performerNameList.list())
        })
        .action(({ from, to, performerNamesAndCategories }) => {
            const fn = type === 'video' ? extractVideo : extractAudio;

            return fn({
                destinationDir: destination,
                filePath: currentFilePathStore.get(),
                from,
                to
            }).then(({ destFilePath }) => {
                logger.log('Extraction complete');

                if (performerNamesAndCategories) {
                    categoriesAndPerformerNamesHandler(performerNamesAndCategories, destFilePath);
                }
            });
        });
};
