const assert = require('assert');
const fs = require('fs');
const path = require('path');

const logger = require('../vorpals/logger');

module.exports = (filePath, content) => {
    assert(path.isAbsolute(filePath), `File path must be absolute. Was ${filePath}`);

    fs.writeFileSync(filePath, content);
    logger.log(`Wrote ${filePath}`);
};
