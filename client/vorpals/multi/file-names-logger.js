const assert = require("assert");
const chalk = require("chalk");

const matchesGlob = require("../../file-system/matches-glob");
const fileFinder = require("../../file-system/finder");
const removeCurrentWd = require("../../helpers/remove-current-wd");
const logger = require("../logger");
const printPathsService = require("../../helpers/print-paths-service");

module.exports = filter => {
  assert(filter);

  const allRelativeFilePaths = fileFinder
    .mediaFiles({ recursive: true })
    .map(removeCurrentWd);

  const data = allRelativeFilePaths.map(relativeFileName => ({
    value: relativeFileName,
    hidden: !matchesGlob(relativeFileName, filter)
  }));

  printPathsService.asList(data);

  const numMatch = data.filter(e => !e.hidden).length;

  logger.log(
    `\n${numMatch}/${data.length} files. Select with ${chalk.bold("s [index]")}`
  );
};
