const inquirer = require("inquirer");
const assert = require("assert");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const fileMover = require("./mover");
const promptCreateFolder = require("./prompt-create-folder");
const printPathsService = require("../helpers/print-paths-service");
const removeCurrentWd = require("../helpers/remove-current-wd");

inquirer.registerPrompt("fuzzypath", require("inquirer-fuzzy-path"));

let previousBaseName;

module.exports = async ({ filePaths, destDirPath }) => {
  assert(
    filePaths && filePaths.constructor === Array,
    `File paths must be an array. Was ${filePaths}`
  );

  printPathsService.asList(filePaths.map(entry => removeCurrentWd(entry)));

  const fileNameCandidates = await promptCreateFolder(destDirPath);
  const subdirectoryPaths = fileNameCandidates
    .map(fileNameCandidate => path.join(destDirPath, fileNameCandidate))
    .filter(filePathCandidate => fs.statSync(filePathCandidate).isDirectory());
  if (!subdirectoryPaths.length) {
    await fileMover.moveAll({
      filePaths,
      destDirPath
    });
    return;
  }

  const defaultChoice = subdirectoryPaths.find(
    subdirectoryPath => path.parse(subdirectoryPath).base === previousBaseName
  );
  const { moveDestination } = await inquirer.prompt({
    type: "fuzzypath",
    itemType: "directory",
    depthLimit: 1,
    pageSize: 20,
    rootPath: destDirPath,
    default: defaultChoice,
    message: `Where do you want to move the above ${chalk.yellow(
      filePaths.length
    )} files?`,
    name: "moveDestination"
  });

  previousBaseName = path.parse(moveDestination).base;
  await fileMover.moveAll({
    filePaths,
    destDirPath: moveDestination
  });
};
