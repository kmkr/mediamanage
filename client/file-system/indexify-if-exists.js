const fs = require("fs");
const chalk = require("chalk");

const logger = require("../vorpals/logger");
const removeCurrentWd = require("../helpers/remove-current-wd");
const { indexify } = require("../helpers/renamer/on-processing-renamer-helper");

module.exports = filePath => {
  let changed = false;
  while (fs.existsSync(filePath)) {
    filePath = indexify(filePath);
    changed = true;
  }
  if (changed) {
    logger.log(`Indexified to ${chalk.green(removeCurrentWd(filePath))}`);
  }
  return filePath;
};
