const inquirer = require("inquirer");
const assert = require("assert");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const fileMover = require("./mover");
const promptCreateFolder = require("./prompt-create-folder");
const printPathsService = require("../helpers/print-paths-service");
const removeCurrentWd = require("../helpers/remove-current-wd");

let previousChoice;

module.exports = async ({ filePaths, destDirPath }) => {
  assert(
    filePaths && filePaths.constructor === Array,
    `File paths must be an array. Was ${filePaths}`
  );

  printPathsService.asList(filePaths.map(entry => removeCurrentWd(entry)));

  const fileNameCandidates = await promptCreateFolder(destDirPath);
  const destinationDirAlternatives = fileNameCandidates.filter(
    fileNameCandidate =>
      fs.statSync(path.join(destDirPath, fileNameCandidate)).isDirectory()
  );
  if (destinationDirAlternatives.length) {
    const defaultChoice = destinationDirAlternatives.includes(previousChoice)
      ? previousChoice
      : destinationDirAlternatives[0];
    const { moveDestination } = await inquirer.prompt({
      default: defaultChoice,
      message: `Where do you want to move the above ${chalk.yellow(
        filePaths.length
      )} files?`,
      name: "moveDestination",
      type: "list",
      choices: destinationDirAlternatives
    });
    if (!moveDestination) {
      return;
    }
    previousChoice = moveDestination;
    destDirPath = path.resolve(destDirPath, moveDestination);
    await fileMover.moveAll({
      filePaths,
      destDirPath
    });
    return;
  } else {
    // Guard while waiting for https://github.com/dthree/vorpal/issues/165
    const { confirmMove } = await inquirer.prompt({
      message: `Confirm move of ${chalk.yellow(filePaths.length)} files`,
      name: "confirmMove",
      type: "confirm"
    });
    if (!confirmMove) {
      return;
    }

    destDirPath = path.resolve(destDirPath);
    await fileMover.moveAll({
      filePaths,
      destDirPath
    });
  }
};
