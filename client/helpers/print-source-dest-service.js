const assert = require('assert');
const chalk = require('vorpal')().chalk;
const leftPad = require('left-pad');
const path = require('path');

const logger = require('../vorpals/logger');
const findCommonPartsInStrings = require('./find-common-parts-in-strings');

module.exports = ({ sourceFilePaths, destFilePaths }) => {
    assert(Array.isArray(sourceFilePaths), 'Source paths must be an array');
    assert(Array.isArray(destFilePaths), 'Dest paths must be an array');
    assert(sourceFilePaths.length === destFilePaths.length, 'Source and dest path length must be equal');
    assert(sourceFilePaths.length > 0, 'Paths cannot be empty');

    const longestSource = sourceFilePaths
        .map(sourceFilePath => path.parse(sourceFilePath).name.length)
        .reduce((prevVal, curVal) => Math.max(prevVal, curVal), 0);

    const commonPart = findCommonPartsInStrings([
        ...sourceFilePaths,
        ...destFilePaths
    ]);

    function clean(input) {
        return input
            .replace(commonPart, '')
            .replace(new RegExp(`^${path.sep}`), '');
    }

    sourceFilePaths.forEach((sourcePath, index) => {
        logger.log(`${chalk.yellow(leftPad(clean(sourcePath), longestSource))} → ${chalk.green(clean(destFilePaths[index]))}`);
    });
};
