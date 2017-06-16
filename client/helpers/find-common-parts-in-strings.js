const path = require('path');

module.exports = strings => {
    if (!strings.length || strings.length === 1) {
        return strings;
    }

    const commonParts = [];
    let isBreaked;

    strings[0].split(path.sep).forEach((pathPart, index) => {
        if (isBreaked) {
            return;
        }
        if (strings.every(string => {
            return string.split(path.sep)[index] === pathPart;
        })) {
            commonParts.push(pathPart);
        } else {
            isBreaked = true;
        }
    });

    return commonParts.join(path.sep);
};
