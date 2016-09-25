const assert = require('assert');

const currentFilePathStore = require('./current-file-path-store');
const fileRenamer = require('../../file-system/renamer');
const {extractAudio, extractVideo, validate} = require('../../media-extract');
const logger = require('../logger');
const performerNameList = require('../../performers/performer-name-list');

function setPerformerNames(performerNames, filePath) {
    assert(performerNames.constructor === Array, `Names must be an array. Was ${performerNames}`);
    return fileRenamer.setPerformerNames(performerNames, filePath);
}

module.exports = (vorpal, extractOption) => {
    const {commandKey, destination, type} = extractOption;
    const commandPrompt = `${commandKey} <from> <to> [performerNames...]`;

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
            data: performerNameList.list
        })
        .action(({from, to, performerNames}) => {
            const fn = type === 'video' ? extractVideo : extractAudio;

            return fn({
                destinationDir: destination,
                filePath: currentFilePathStore.get(),
                from,
                to
            }).then(({destFilePath}) => {
                logger.log('Extraction complete');
                if (performerNames) {
                    setPerformerNames(performerNames, destFilePath);
                }
            });
        });
};
