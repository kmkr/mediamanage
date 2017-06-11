const assert = require('assert');

const logger = require('../vorpals/logger');
const removeCurrentWdHelper = require('./remove-current-wd');
const findCommonPartsInStrings = require('./find-common-parts-in-strings');

module.exports = ({ sourceFilePaths, destFilePaths }) => {
    assert(Array.isArray(sourceFilePaths), 'Source paths must be an array');
    assert(Array.isArray(destFilePaths), 'Dest paths must be an array');
    assert(sourceFilePaths.length === destFilePaths.length, 'Source and dest path length must be equal');
    assert(sourceFilePaths.length > 0, 'Paths cannot be empty');

    const commonPart = findCommonPartsInStrings([
        ...sourceFilePaths,
        ...destFilePaths
    ]);

    const data = sourceFilePaths.map((sourcePath, index) => {
        const row = [
            removeCurrentWdHelper(sourcePath),
            removeCurrentWdHelper(destFilePaths[index])
        ];
        if (sourceFilePaths.length > 1) {
            data.unshift(index + 1);
        }
        return row;
    });

    sourceFilePaths.forEach((sourcePath, index) => {
        logger.log(`From ${sourcePath.replace(commonPart, '')}`);
        logger.log(`To   ${destFilePaths[index].replace(commonPart, '')}`);
    });
};
