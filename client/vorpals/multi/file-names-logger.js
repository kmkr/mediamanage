const chalk = require('vorpal')().chalk;
const path = require('path');
const leftPad = require('left-pad');

const fileFinder = require('../../file-system/finder');
const removeCurrentWdHelper = require('../../helpers/remove-current-wd');
const logger = require('../logger');

function getLongestDirLength(relativeFilePaths) {
    return relativeFilePaths
        .map(entry => path.parse(entry).dir.length)
        .sort()
        .reverse()[0] || 0;
}

module.exports = (filter = '') => {
    const relativeFilePaths = fileFinder
        .mediaFiles({ recursive: true })
        .map(removeCurrentWdHelper)
        .filter(relativeFileName => relativeFileName.toLowerCase().match(filter.toLowerCase()));

    const longestDirLength = getLongestDirLength(relativeFilePaths);
    const indexLeftPad = `${relativeFilePaths.length}`.length;

    relativeFilePaths.forEach((relativeFilePath, index) => {
        const { dir, base } = path.parse(relativeFilePath);
        logger.log(`${leftPad(index, indexLeftPad)}) ${leftPad(dir, longestDirLength)}/${chalk.green(base)}`);
    });

    logger.log('Select with s [index]');
};
