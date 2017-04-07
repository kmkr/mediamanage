const assert = require('assert');
const table = require('table/dist/table');

const logger = require('../vorpals/logger');
const removeCurrentWdHelper = require('../helpers/remove-current-wd');

const configTwoCols = {
    columns: {
        0: {
            width: 75
        },
        1: {
            width: 75
        }
    }
};

const configThreeCols = {
    columns: {
        0: {
            width: 20
        },
        1: {
            width: 65
        },
        2: {
            width: 65
        }
    }
};

module.exports = ({ sourceFilePaths, destFilePaths }) => {
    assert(Array.isArray(sourceFilePaths), 'Source paths must be an array');
    assert(Array.isArray(destFilePaths), 'Dest paths must be an array');
    assert(sourceFilePaths.length === destFilePaths.length, 'Source and dest path length must be equal');
    assert(sourceFilePaths.length > 0, 'Paths cannot be empty');

    const config = sourceFilePaths.length === 1 ? configTwoCols : configThreeCols;
    const data = sourceFilePaths.map((sourcePath, index) => {
        const row = [
            removeCurrentWdHelper(sourcePath),
            removeCurrentWdHelper(destFilePaths[index])
        ];
        if (sourceFilePaths.length > 1) {
            data.unshift(index + 1);
        }
        return row;
    });

    logger.log(table(data, config));
};
