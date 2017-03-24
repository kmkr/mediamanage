const fs = require('fs');
const finder = require('./finder');
const config = require('../config.json');
const logger = require('../vorpals/logger');

function unique(el, i, a) {
    return i === a.indexOf(el);
}

module.exports = filter => {
    const sources = config.moveMediaOptions
        .map(o => o.toDir)
        .sort()
        .filter(unique)
        .filter(filePath => fs.existsSync(filePath));

    sources.forEach(source => {
        const hits = finder.mediaFiles({
            dirPath: source,
            recursive: true,
            filter
        });

        if (hits.length) {
            logger.log('Found matching files');
        }
        hits.forEach(hit => {
            logger.log(hit);
        });
    });
};
