const path = require('path');

const { allFiles } = require('../file-system/finder');
const removeCurrentWd = require('./remove-current-wd');
const { flatten, unique } = require('./array-helper');

const REPLACE_REGEXP = /[^a-z0-9]/ig;

module.exports = () => {
    const currentDirName = path.parse(process.cwd()).base;

    const fileNames = allFiles({ includeDir: true })
        .map(filePath => removeCurrentWd(filePath));

    return [currentDirName, ...fileNames]
        .map(fileName => fileName.toLowerCase())
        .map(fileName => path.parse(fileName).name)
        .map(fileName => fileName.replace(REPLACE_REGEXP, ' '))
        .map(fileName => fileName.split(' '))
        .reduce(flatten, [])
        .sort()
        .filter(unique)
        .filter(keyword => keyword)
        .filter(keyword => /0-9/.test(keyword) || keyword.length > 1);
};
