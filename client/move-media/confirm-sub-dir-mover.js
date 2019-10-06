const assert = require("assert");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const fileMover = require("./mover");
const promptCreateFolder = require("./prompt-create-folder");
const printPathsService = require("../helpers/print-paths-service");
const removeCurrentWd = require("../helpers/remove-current-wd");

let previousChoice;

module.exports = async ({ filePaths, destDirPath, vorpalInstance }) => {
  assert(
    filePaths && filePaths.constructor === Array,
    `File paths must be an array. Was ${filePaths}`
  );

  printPathsService.asList(filePaths.map(entry => removeCurrentWd(entry)));

  const fileNameCandidates = await promptCreateFolder(
    destDirPath,
    vorpalInstance
  );
  const destinationDirAlternatives = fileNameCandidates.filter(
    fileNameCandidate =>
      fs.statSync(path.join(destDirPath, fileNameCandidate)).isDirectory()
  );
  if (destinationDirAlternatives.length) {
    // Add abort as an option while waiting for https://github.com/dthree/vorpal/issues/165
    const ABORT = "Abort move";
    destinationDirAlternatives.unshift(ABORT);

    const defaultChoice = destinationDirAlternatives.includes(previousChoice)
      ? previousChoice
      : ABORT;
    const { moveDestination } = await vorpalInstance.activeCommand.prompt({
      message: `Where do you want to move the above ${chalk.yellow(
        filePaths.length
      )} files?`,
      default: defaultChoice,
      name: "moveDestination",
      type: "list",
      choices: destinationDirAlternatives
    });
    if (!moveDestination || moveDestination === ABORT) {
      return;
    }
    previousChoice = moveDestination;
    destDirPath = path.resolve(destDirPath, moveDestination);
    return fileMover.moveAll({
      filePaths,
      destDirPath,
      vorpalInstance
    });
  } else {
    // Guard while waiting for https://github.com/dthree/vorpal/issues/165
    const { confirmMove } = vorpalInstance.activeCommand.prompt({
      message: `Confirm move of ${chalk.yellow(filePaths.length)} files`,
      name: "confirmMove",
      type: "confirm"
    });
    if (!confirmMove) {
      return;
    }

    destDirPath = path.resolve(destDirPath);
    return fileMover.moveAll({
      filePaths,
      destDirPath,
      vorpalInstance
    });
  }
};
