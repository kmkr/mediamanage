const assert = require('assert');
const chalk = require('vorpal')().chalk;
const leftPad = require('left-pad');
const path = require('path');

const logger = require('../vorpals/logger');
const findCommonPartsInStrings = require('./find-common-parts-in-strings');

function getLongestDirLength(paths) {
    return paths
        .map(entry => path.parse(entry).dir.length)
        .reduce((prevVal, curVal) => Math.max(prevVal, curVal), 0);
}

exports.asPairsOfLists = ({ sourceFilePaths, destFilePaths }) => {
    assert(Array.isArray(sourceFilePaths), 'Source paths must be an array');
    assert(Array.isArray(destFilePaths), 'Dest paths must be an array');
    assert(sourceFilePaths.length === destFilePaths.length, 'Source and dest path length must be equal');
    assert(sourceFilePaths.length > 0, 'Paths cannot be empty');

    const commonPart = findCommonPartsInStrings([
        ...sourceFilePaths,
        ...destFilePaths
    ]);

    const commonPartPrefix = '{..}';
    const longestSourceDir = getLongestDirLength(sourceFilePaths) - commonPart.length + commonPartPrefix.length - 1;

    function clean(input) {
        if (!commonPart) {
            return input;
        }

        return input
            .replace(commonPart, '')
            .replace(new RegExp(`^${path.sep}`), commonPartPrefix);
    }

    sourceFilePaths.forEach((sourcePath, index) => {
        const { dir: sDir, name: sName, ext: sExt } = path.parse(clean(sourcePath));
        const { dir: dDir, name: dName, ext: dExt } = path.parse(clean(destFilePaths[index]));
        logger.log(`${chalk.yellow(leftPad(clean(sDir), longestSourceDir))}${path.sep}${sName}${sExt} → ${chalk.green(clean(dDir))}${path.sep}${dName}${dExt}`);
    });
};

exports.asList = paths => {
    assert(Array.isArray(paths), 'Paths must be an array');

    const longestDirLength = getLongestDirLength(paths.filter(p => !p.hidden).map(p => p.value || p));
    const indexLeftPad = `${paths.length}`.length;

    paths.forEach((entry, index) => {
        const isObjectEntry = typeof entry === 'object';

        const hidden = isObjectEntry && entry.hidden;
        const { dir, base } = path.parse(isObjectEntry ? entry.value : entry);

        if (!hidden) {
            logger.log(`${leftPad(index, indexLeftPad)}) ${leftPad(dir, longestDirLength)}${dir ? path.sep : ' '}${chalk.green(base)}`);
        }
    });

};
