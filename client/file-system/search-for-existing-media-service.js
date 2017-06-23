const chalk = require('vorpal')().chalk;
const fs = require('fs');
const path = require('path');
const finder = require('./finder');
const config = require('../config.json');
const logger = require('../vorpals/logger');
const { flatten, unique } = require('../helpers/array-helper');

const REPLACE_REGEXP = /[^a-z0-9]/ig;
let fileCache;

// Assumes title is the first part of the file name and that parts are split by "_"
function getTitle(fileName) {
    return fileName.split('_')[0];
}

function allFiles() {
    const sourcePaths = config.moveMediaOptions
        .map(o => o.toDir)
        .sort()
        .filter(unique)
        .filter(filePath => fs.existsSync(filePath));

    return sourcePaths.map(sourcePath => (
        finder.mediaFiles({
            dirPath: sourcePath,
            recursive: true
        }).map(filePath => ({
            filePath,
            sourcePath
        }))
    )).reduce(flatten, []);
}

function clean(label) {
    return label.replace(REPLACE_REGEXP, ' ');
}

function isMatch(thisLabel, otherLabel) {
    const cleanedThisLabel = clean(thisLabel);
    const cleanedOtherLabel = clean(otherLabel);
    return cleanedThisLabel.includes(cleanedOtherLabel) || cleanedOtherLabel.includes(cleanedThisLabel);
}

function log(hits) {
    if (hits.length) {
        logger.log(chalk.red('Found existing files matching this file:'));
    }
    hits.forEach(hit => {
        const { filePath, sourcePath } = hit;
        logger.log(filePath.replace(sourcePath, ''));
    });
    logger.log('\n');
}

exports.byTitle = thisTitle => {
    if (!fileCache) {
        fileCache = allFiles();
    }

    const hits = fileCache.filter(({ filePath }) => {
        const thatFileName = path.parse(filePath).name.toLowerCase();
        const thatTitle = getTitle(thatFileName);
        return isMatch(thisTitle.toLowerCase(), thatTitle);
    });

    log(hits);
};

exports.byFileName = thisFilePath => {
    if (!fileCache) {
        fileCache = allFiles();
    }

    const thisFileName = path.parse(thisFilePath).name.toLowerCase();
    const hits = fileCache.filter(({ filePath }) => {
        const thatFileName = path.parse(filePath).name.toLowerCase();
        return isMatch(thisFileName, thatFileName);
    });

    log(hits);
};
