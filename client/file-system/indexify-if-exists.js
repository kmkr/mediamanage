const fs = require('fs');

const logger = require('../vorpals/logger');
const removeCurrentWdHelper = require('../helpers/remove-current-wd');
const {indexify} = require('./renamer-helper');

function exists(filePath) {
    try {
        fs.statSync(filePath);
        return true;
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        }
        throw e;
    }
}

module.exports = filePath => {
    while (true) {
        if (exists(filePath)) {
            logger.log(`Found file ${removeCurrentWdHelper(filePath)} to be present. Indexifying...`);
            filePath = indexify(filePath);
        } else {
            return filePath;
        }
    }
};
