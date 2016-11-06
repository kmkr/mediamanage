const path = require('path');

const { allFiles } = require('./finder');
const removeCurrentWd = require('../helpers/remove-current-wd');

const REPLACE_REGEXP = /[^a-z0-9]/ig;

module.exports = () => {
    const currentDirName = path.parse(process.cwd()).base;

    const fileNames = allFiles()
        .map(filePath => removeCurrentWd(filePath));

    return [currentDirName, ...fileNames]
        .map(fileName => fileName.toLowerCase())
        .map(fileName => path.parse(fileName).name)
        .map(fileName => fileName.replace(REPLACE_REGEXP, ' '))
        .map(fileName => fileName.split(' '))
        .reduce((flat, toFlatten) => (
            flat.concat(toFlatten)
        ), [])
        .sort()
        .filter((el, i, a) => (
            i === a.indexOf(el)
        ))
        .filter(keyword => keyword)
        .filter(keyword => /0-9/.test(keyword) || keyword.length > 1);
};
