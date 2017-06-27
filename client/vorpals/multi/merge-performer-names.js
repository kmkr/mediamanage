const path = require('path');

const logger = require('../logger');
const finder = require('../../file-system/finder');
const performerNames = require('../../performers/performer-name-list');
const { flatten } = require('../../helpers/array-helper');
const existingMediaParser = require('../../helpers/existing-media-parser');

module.exports = vorpal => {
    const allVideos = finder.video({ recursive: true });
    const performerNamesFromVideos = allVideos
        .map(filePath => existingMediaParser.getPerformerNames(filePath))
        .reduce(flatten, []);

    vorpal.activeCommand.prompt({
        message: 'Which names do you want to merge?',
        type: 'checkbox',
        name: 'mergeCandidates',
        choices: performerNamesFromVideos
    }, ({ mergeCandidates }) => {
        if (mergeCandidates.length < 2) {
            logger.log('Merge canceled');
            return Promise.resolve();
        }

        return vorpal.activeCommand.prompt({
            message: 'Which of the names do you want to use?',
            type: 'list',
            name: 'nameToUse',
            choices: mergeCandidates
        }, ({ nameToUse }) => {
            if (!nameToUse) {
                logger.log('Merge canceled');
                return Promise.resolve();
            }

            const namesToMerge = mergeCandidates.filter(mergeCandidate => mergeCandidate !== nameToUse);

            const matchingVideos = finder.video({ recursive: true })
                .filter(filePath => {
                    const fileName = path.parse(filePath).name;
                    return namesToMerge.some(nameToMerge => fileName.includes(nameToMerge));
                });

            if (!matchingVideos.length) {
                logger.log('No matching videos found. Merge canceled.');
                return Promise.resolve();
            }

            matchingVideos.map(filePath => {
                const { ext, dir, name: fileName } = path.parse(filePath);
                const newFileName = namesToMerge.reduce((prevVal, curVal) => (
                    prevVal.replace(new RegExp(curVal, 'g'), nameToUse)
                ), fileName);
                logger.log(`mv ${filePath} ${dir}${path.sep}${newFileName}${ext}`);
            });

            performerNames.remove(namesToMerge);

            return Promise.resolve();
        });
    });
};
