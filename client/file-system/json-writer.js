const assert = require('assert');
const fs = require('fs');
const path = require('path');

module.exports = (filePath, content) => {
    assert(path.isAbsolute(filePath), `File path must be absolute, was ${filePath}`);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
};
