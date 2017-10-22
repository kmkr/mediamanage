const config = require('../../config.json');
const currentFilePathStore = require('./current-file-path-store');
const { extractAudio, extractVideo, validate } = require('../../media-extract');
const logger = require('../logger');
const performerNameList = require('../../performers/performer-name-list');
const categoriesAndPerformerNamesHandler = require('../../performers/categories-and-performer-names-handler');

let autoFillInput = '';

module.exports = (vorpal, extractOption) => {
    const { commandKey, destination, type } = extractOption;
    const commandPrompt = `${commandKey} <from> <to> [performerNamesAndCategories...]`;

    vorpal
        .command(commandPrompt, `Extract to ${destination}`)
        .types({
            string: ['_']
        })
        .validate(({ from, to, performerNamesAndCategories = [] }) => {
            const isValid = validate({ from, to, performerNamesAndCategories });
            if (!isValid) {
                logger.log('Invalid input');
            }

            autoFillInput = [to].concat(performerNamesAndCategories).join(' ');
            return isValid;
        })
        .autocomplete({
            data: () => config.categories
                .concat(performerNameList.list())
        })
        .action(({ from, to, performerNamesAndCategories = [] }) => {
            const fn = type === 'video' ? extractVideo : extractAudio;
            performerNamesAndCategories = performerNamesAndCategories.map(entry => entry.trim());

            return fn({
                destinationDir: destination,
                filePath: currentFilePathStore.get(),
                from,
                to
            }).then(({ destFilePath, secondsRemaining }) => {
                logger.log('Extraction complete');

                if (performerNamesAndCategories) {
                    categoriesAndPerformerNamesHandler(performerNamesAndCategories, destFilePath);
                }

                if (secondsRemaining > 60) {
                    setTimeout(() => {
                        vorpal.ui.input(`${commandKey} ${autoFillInput} `);
                    }, 10);
                }
            });
        });
};
