const fs = require('fs');

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
            console.log(`Found file ${filePath} to be present. Indexifying...`);
            filePath = indexify(filePath);
        } else {
            return filePath;
        }
    }
};
