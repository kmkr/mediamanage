const inquirer = require("inquirer");
const rimraf = require("rimraf");
const chalk = require("chalk");

const fileFinder = require("../file-system/finder");
const logger = require("../vorpals/logger");

function clean(rootDir) {
  rimraf.sync(rootDir);
}

module.exports = async () => {
  const rootDir = process.cwd();
  const recursive = true;
  const filePaths = fileFinder.allFiles({
    dirPath: rootDir,
    recursive,
    includeDir: true
  });
  const videoFileNames = fileFinder.video({ dirPath: rootDir, recursive });
  const audioFileNames = fileFinder.audio({ dirPath: rootDir, recursive });

  filePaths.forEach(filePath => logger.log(filePath));

  const autoDelete =
    filePaths.length === 0 ||
    (videoFileNames.length === 0 && audioFileNames.length === 0);

  if (autoDelete) {
    logger.log(`Removing ${chalk.red(rootDir)}`);
    clean(rootDir);
    return;
  }

  const message = `${chalk.bold(filePaths.length)} file(s) left (${chalk.bold(
    videoFileNames.length
  )} video, ${chalk.bold(audioFileNames.length)} audio). Delete?`;

  const { confirmDelete } = await inquirer.prompt({
    message,
    name: "confirmDelete",
    type: "confirm",
    default: false
  });
  if (!confirmDelete) {
    return;
  }

  clean(rootDir, filePaths);
  logger.log(
    `Removed ${chalk.bold(filePaths.length)} file(s) and containing dir`
  );
};
