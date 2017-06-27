const fs = require('fs');

const logger = require('../vorpals/logger');
const removeCurrentWdHelper = require('../helpers/remove-current-wd');
const { indexify } = require('../helpers/renamer-helper');

module.exports = filePath => {
    while (fs.existsSync(filePath)) {
        logger.log(`Found file ${removeCurrentWdHelper(filePath)} to be present. Indexifying...`);
        filePath = indexify(filePath);
    }
    return filePath;
};
