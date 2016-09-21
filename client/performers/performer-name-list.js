const assert = require('assert');
const fs = require('fs');
const path = require('path');

const config = require('../config.json');
const logger = require('../vorpals/logger');

let performerNames = new Set();
if (config && config.autocomplete && config.autocomplete.performerNames) {
    performerNames = new Set(config.autocomplete.performerNames);
}

function performerNamesAsList() {
    return [
        ...performerNames
    ];
}

exports.list = performerNamesAsList;

exports.updateWith = names => {
    assert(names.constructor === Array, `Names must be an array. Was ${names}`);
    const newNames = names.filter(name => !performerNames.has(name));

    if (!newNames.length) {
        return;
    }

    newNames.forEach(name => performerNames.add(name));

    const list = performerNamesAsList().sort();
    const newConfig = Object.assign({}, config, {
        autocomplete: {
            performerNames: list
        }
    });

    const configPath = path.resolve(__dirname, '../config.json');

    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4));
    logger.log(`Updated autocomplete set with ${newNames.join(', ')}`);
};
