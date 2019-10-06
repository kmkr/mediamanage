const chalk = require("chalk");
const path = require("path");
const levenshtein = require("fast-levenshtein");

const logger = require("../vorpals/logger");
const existingMediaParser = require("../helpers/existing-media-parser");
const printPathsService = require("../helpers/print-paths-service");

const getAllFilePaths = require("./get-all-file-paths");

const REPLACE_REGEXP = /[^a-z0-9]/gi;

function clean(label) {
  const lowerCased = label.toLowerCase();
  const categories = existingMediaParser.getCategories(lowerCased);
  return lowerCased
    .replace(categories, "")
    .replace("&", "and")
    .replace(REPLACE_REGEXP, " ");
}

function getDistance(thisLabel, otherLabel) {
  const cleanedThisLabel = clean(thisLabel);
  const cleanedOtherLabel = clean(otherLabel);
  if (
    cleanedThisLabel.includes(cleanedOtherLabel) ||
    cleanedOtherLabel.includes(cleanedThisLabel)
  ) {
    return 0;
  }
  return levenshtein.get(cleanedThisLabel, cleanedOtherLabel);
}

function isMatch(thisLabel, distance) {
  return distance < Math.max(Math.ceil(thisLabel.length * 0.2), 6);
}

function log(hits) {
  if (hits.length) {
    logger.log(`Found ${chalk.red(hits.length)} matching files:\n`);
  }

  printPathsService.asList(hits);
  logger.log("\n");
}

function search(filePaths, fun, logHits = true) {
  if (!filePaths) {
    filePaths = getAllFilePaths();
  }

  const bestMatch = {
    distance: Infinity,
    value: null
  };

  const hits = filePaths.reduce((prevVal, curVal) => {
    const { thisLabel, thatLabel } = fun(curVal);
    const distance = getDistance(thisLabel, thatLabel);

    const match = isMatch(thisLabel, distance);
    if (match) {
      prevVal.push(curVal);
    }
    if (distance < bestMatch.distance) {
      bestMatch.distance = distance;
      bestMatch.value = thatLabel;
    }
    return prevVal;
  }, []);

  if (logHits) {
    logger.log(
      `\n${bestMatch.value} (diff ${chalk.yellow(bestMatch.distance)})\n`
    );
    log(hits);
  }

  return hits;
}

exports.byText = (text, logHits = true, filePaths) => {
  return search(
    filePaths,
    function(filePath) {
      return {
        thisLabel: text,
        thatLabel: path.parse(filePath).name
      };
    },
    logHits
  );
};

exports._isMatch = isMatch;
