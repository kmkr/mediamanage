const chalk = require('chalk');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const removeCurrentWd = require('../helpers/remove-current-wd');

const logger = require('../vorpals/logger');

module.exports = filePath => (
    new Promise(resolve => {
        assert(path.isAbsolute(filePath), `File path must be absolute. Was ${filePath}`);
        fs.unlinkSync(filePath);
        logger.log(`Deleted ${chalk.bold(removeCurrentWd(filePath))}`);

        resolve();
    })
);
