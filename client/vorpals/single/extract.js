const config = require('../../config.json');
const currentFilePathStore = require('./current-file-path-store');
const fileRenamer = require('../../file-system/renamer');
const {extractAudio, extractVideo, validate} = require('../../media-extract');
const logger = require('../logger');
const performerNameList = require('../../performers/performer-name-list');

module.exports = (vorpal, extractOption) => {
    const {commandKey, destination, type} = extractOption;
    const commandPrompt = `${commandKey} <from> <to> [performerNamesAndCategories...]`;

    vorpal
        .command(commandPrompt, `Extract to ${destination}`)
        .validate(({from, to, performerNames}) => {
            const isValid = validate({from, to, performerNames});
            if (!isValid) {
                logger.log('Invalid input');
            }
            return isValid;
        })
        .autocomplete({
            data: () => config.categories.concat(performerNameList.list())
        })
        .action(({from, to, performerNamesAndCategories}) => {
            const fn = type === 'video' ? extractVideo : extractAudio;

            return fn({
                destinationDir: destination,
                filePath: currentFilePathStore.get(),
                from,
                to
            }).then(({destFilePath}) => {
                logger.log('Extraction complete');

                if (performerNamesAndCategories) {
                    const categories = performerNamesAndCategories.filter(entry => config.categories.includes(entry));
                    const performerNames = performerNamesAndCategories.filter(entry => !categories.includes(entry));

                    let filePath = destFilePath;
                    if (performerNames.length) {
                        filePath = fileRenamer.setPerformerNames(performerNames, filePath);
                    }
                    if (categories.length) {
                        fileRenamer.setCategories(categories, filePath);
                    }
                }
            });
        });
};
