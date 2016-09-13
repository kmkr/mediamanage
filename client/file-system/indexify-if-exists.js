const fs = require('fs');

const {indexify} = require('./renamer-helper');

module.exports = filePath => {
    try {
        fs.statSync(filePath);
        console.log(`Found file ${filePath} to be present. Indexifying...`);
        return indexify(filePath);
    } catch (e) {
        return filePath;
    }
};
