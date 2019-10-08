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
  const subDirectories = fileNameCandidates.filter(fileNameCandidate =>
    fs.statSync(path.join(destDirPath, fileNameCandidate)).isDirectory()
  );
  if (subDirectories.length) {
    const defaultChoice = subDirectories.includes(previousChoice)
      ? previousChoice
      : subDirectories[0];
    const { moveDestination } = await inquirer.prompt({
      default: defaultChoice,
      message: `Where do you want to move the above ${chalk.yellow(
        filePaths.length
      )} files?`,
      name: "moveDestination",
      type: "list",
      choices: subDirectories
    });

    previousChoice = moveDestination;
    destDirPath = path.resolve(destDirPath, moveDestination);
  } else {
    destDirPath = path.resolve(destDirPath);
  }
  await fileMover.moveAll({
    filePaths,
    destDirPath
  });
};
