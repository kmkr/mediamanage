const chalk = require('vorpal')().chalk;
const fs = require('fs');
const path = require('path');
const finder = require('./finder');
const config = require('../config.json');
const logger = require('../vorpals/logger');

let fileCache;

function unique(el, i, a) {
    return i === a.indexOf(el);
}

// Assumes title is the first part of the file name and that parts are split by "_"
function getTitle(fileName) {
    return fileName.split('_')[0];
}

function allFiles() {
    const sources = config.moveMediaOptions
        .map(o => o.toDir)
        .sort()
        .filter(unique)
        .filter(filePath => fs.existsSync(filePath));

    return sources.map(source => (
        finder.mediaFiles({
            dirPath: source,
            recursive: true
        })
    )).reduce((flat, toFlatten) => (
        flat.concat(toFlatten)
    ), []);
}

function isMatch(thisLabel, otherLabel) {
    return otherLabel.includes(thisLabel) ||
        otherLabel.replace(/and/g, '&').includes(thisLabel) ||
        otherLabel.replace(/&/g, 'and').includes(thisLabel) ||
        otherLabel.replace(/'/g, '').includes(thisLabel) ||
        thisLabel.replace(/'/g, '').includes(otherLabel);
}

function log(hits) {
    if (hits.length) {
        logger.log(chalk.red('Found files matching this title:\n'));
    }
    hits.forEach(hit => {
        logger.log(hit);
    });
}

exports.byTitle = thisTitle => {
    if (!fileCache) {
        fileCache = allFiles();
    }

    const hits = fileCache.filter(filePath => {
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
    const hits = fileCache.filter(filePath => {
        const thatFileName = path.parse(filePath).name.toLowerCase();
        return isMatch(thisFileName, thatFileName);
    });

    log(hits);
};
