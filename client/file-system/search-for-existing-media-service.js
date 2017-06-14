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

function isMatch(fileName, thisTitle) {
    const fileTitle = getTitle(fileName);
    return fileTitle.includes(thisTitle) ||
        fileTitle.replace(/and/g, '&').includes(thisTitle) ||
        fileTitle.replace(/&/g, 'and').includes(thisTitle) ||
        fileTitle.replace(/'/g, '').includes(thisTitle) ||
        thisTitle.replace(/'/g, '').includes(fileTitle);
}

module.exports = thisTitle => {
    if (!fileCache) {
        fileCache = allFiles();
    }

    const hits = fileCache.filter(filePath => (
        isMatch(path.parse(filePath).name.toLowerCase(), thisTitle.toLowerCase())
    ));

    if (hits.length) {
        logger.log(chalk.red('Found files matching this title:\n'));
    }
    hits.forEach(hit => {
        logger.log(hit);
    });
};
