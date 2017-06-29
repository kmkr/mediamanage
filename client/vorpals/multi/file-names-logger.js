const minimatch = require('minimatch');
const chalk = require('chalk');

const fileFinder = require('../../file-system/finder');
const removeCurrentWd = require('../../helpers/remove-current-wd');
const logger = require('../logger');
const printPathsService = require('../../helpers/print-paths-service');

module.exports = (filter = '*') => {
    const allRelativeFilePaths = fileFinder
        .mediaFiles({ recursive: true })
        .map(removeCurrentWd);

    const data = allRelativeFilePaths.map(relativeFileName => ({
        value: relativeFileName,
        hidden: !minimatch(relativeFileName, filter, { nocase: true })
    }));

    printPathsService.asList(data);

    logger.log(`\nSelect with ${chalk.bold('s [index]')}`);
};
