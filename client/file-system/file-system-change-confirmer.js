const table = require('table/dist/table');

const logger = require('../vorpals/logger');
const removeCurrentWdHelper = require('../helpers/remove-current-wd');

const config = {
    columns: {
        0: {
            width: 70
        },
        1: {
            width: 70
        }
    }
};

module.exports = (sourceFilePath, destFilePath) => {
    const data = [
        [
            removeCurrentWdHelper(sourceFilePath),
            removeCurrentWdHelper(destFilePath)
        ]
    ];
    logger.log(table(data, config));
};

