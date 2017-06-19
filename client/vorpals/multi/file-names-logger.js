const chalk = require('vorpal')().chalk;
const path = require('path');
const leftPad = require('left-pad');
const minimatch = require('minimatch');

const fileFinder = require('../../file-system/finder');
const removeCurrentWdHelper = require('../../helpers/remove-current-wd');
const logger = require('../logger');

function getLongestDirLength(relativeFilePaths) {
    return relativeFilePaths
        .map(entry => path.parse(entry).dir.length)
        .reduce((prevVal, curVal) => Math.max(prevVal, curVal), 0);
}

module.exports = (filter = '*') => {
    const allRelativeFilePaths = fileFinder
        .mediaFiles({ recursive: true })
        .map(removeCurrentWdHelper);

    const relevantRelativeFilePaths = allRelativeFilePaths
        .filter(relativeFileName => minimatch(relativeFileName, filter, { nocase: true }));

    const longestDirLength = getLongestDirLength(relevantRelativeFilePaths);
    const indexLeftPad = `${relevantRelativeFilePaths.length}`.length;

    allRelativeFilePaths.forEach((relativeFilePath, index) => {
        // Loop all to get indices correct
        if (relevantRelativeFilePaths.includes(relativeFilePath)) {
            const { dir, base } = path.parse(relativeFilePath);
            logger.log(`${leftPad(index, indexLeftPad)}) ${leftPad(dir, longestDirLength)}/${chalk.green(base)}`);
        }
    });

    logger.log('Select with s [index]');
};
