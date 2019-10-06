const chalk = require("chalk");
const assert = require("assert");
const jsonWriter = require("../file-system/json-writer");
const path = require("path");

const config = require("../config.json");
const logger = require("../vorpals/logger");

function getFromFile() {
  if (config && config.autocomplete && config.autocomplete.performerNames) {
    return new Set(config.autocomplete.performerNames);
  }

  logger.log("Unable to find autocomplete.performerNames in config.json");
  return new Set();
}

const performerNames = getFromFile();

function performerNamesAsList() {
  return [...performerNames];
}

exports.list = performerNamesAsList;

function update() {
  const persistedList = getFromFile();
  const inMemoryList = performerNamesAsList();

  const additions = [...inMemoryList].filter(
    entry => !persistedList.has(entry)
  );
  const removals = [...persistedList].filter(
    entry => !inMemoryList.includes(entry)
  );

  if (!additions.length && !removals.length) {
    return;
  }

  const newConfig = Object.assign({}, config, {
    autocomplete: {
      performerNames: inMemoryList
    }
  });

  const configPath = path.resolve(__dirname, "../config.json");
  jsonWriter(configPath, newConfig);

  const additionsStr = additions.length
    ? `Added ${additions.map(a => chalk.bold(a)).join(", ")}`
    : "No additions";
  const removalsStr = removals.length
    ? `removed ${removals.map(r => chalk.bold(r)).join(", ")}`
    : "no removals";
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
