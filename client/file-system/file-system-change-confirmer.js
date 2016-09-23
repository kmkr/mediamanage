const Table = require('cli-table');
const logger = require('../vorpals/logger');
const removeCurrentWdHelper = require('../helpers/remove-current-wd');

module.exports = (sourceFilePath, destFilePath) => {
    const table = new Table({
        head: ['From', 'To'],
        colWidths: [75, 75]
    });
    table.push([
        removeCurrentWdHelper(sourceFilePath),
        removeCurrentWdHelper(destFilePath)
    ]);
    logger.log(table.toString());
};
