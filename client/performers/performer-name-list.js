const assert = require('assert');
const fs = require('fs');
const path = require('path');

const config = require('../config.json');
const logger = require('../vorpals/logger');

function getFromFile() {
    if (config && config.autocomplete && config.autocomplete.performerNames) {
        return new Set(config.autocomplete.performerNames);
    }

    logger.log('Unable to find autocomplete.performerNames in config.json');
    return new Set();
}

const performerNames = getFromFile();

function performerNamesAsList() {
    return [
        ...performerNames
    ];
}

exports.list = performerNamesAsList;

function update() {
    const oldList = getFromFile();
    const list = performerNamesAsList();

    const additions = [...list].filter(entry => !oldList.has(entry));
    const removals = [...oldList].filter(entry => !list.includes(entry));

    if (!additions.length && !removals.length) {
        return;
    }

    const newConfig = Object.assign({}, config, {
        autocomplete: {
            performerNames: list
        }
    });

    const configPath = path.resolve(__dirname, '../config.json');

    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4));

    const additionsStr = additions.length ? `Added ${additions.join(', ')}` : 'No additions';
    const removalsStr = removals.length ? `removed ${removals.join(', ')}` : 'no removals';
    logger.log(`Updated autocomplete set. ${additionsStr}, ${removalsStr}.`);
}

exports.add = names => {
    assert(Array.isArray(names), `Names must be an array. Was ${names}`);
    names
        .filter(name => !performerNames.has(name))
        .forEach(name => performerNames.add(name));
    update();
};

exports.remove = names => {
    assert(Array.isArray(names), `Names must be an array. Was ${names}`);

    names
        .filter(name => performerNames.has(name))
        .forEach(name => performerNames.delete(name));
    update();
};
