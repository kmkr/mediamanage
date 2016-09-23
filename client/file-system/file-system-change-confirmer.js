const table = require('table');
const removeCurrentWdHelper = require('../helpers/remove-current-wd');

const config = {
    columnDefault: {
        width: 70
    },
    columnCount: 2,
    columns: {
        0: {
            width: 70
        },
        1: {
            width: 70
        }
    }
};

const stream = table.createStream(config);

module.exports = (sourceFilePath, destFilePath) => {
    stream.write([
        removeCurrentWdHelper(sourceFilePath),
        removeCurrentWdHelper(destFilePath)
    ]);
};
