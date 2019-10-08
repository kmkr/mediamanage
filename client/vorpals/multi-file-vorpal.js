const Vorpal = require("vorpal");
const chalk = Vorpal().chalk; // eslint-disable-line new-cap
const Promise = require("bluebird");

const fileFinder = require("../file-system/finder");
const moveMedia = require("../move-media/move-media");
const undoMove = require("../move-media/undo-move");
const cleanDirectory = require("../clean-directory");
const fileNamesLogger = require("./multi/file-names-logger");

const logger = require("./logger");

module.exports = function(onGoToFile) {
  const vorpal = new Vorpal();
  logger.setLogger(vorpal.log.bind(vorpal));
  vorpal.on("client_command_executed", () => {
    logger.log("\n");
  });

  fileNamesLogger();
  logger.log("\n");

  vorpal
    .command(
      "l [filter]",
      'List media. Filter is a minimatch pattern. Defaults to "*".'
    )
    .action(async ({ filter = "*" }) => {
      fileNamesLogger(filter);
    });

  vorpal.command("ll", "List recursive media").action(async () => {
    fileNamesLogger("**/**");
  });

  vorpal.command("m", "Move media").action(async () => {
    await moveMedia.all(vorpal);
    cleanDirectory(vorpal);
  });

  vorpal.command("u", "Undo move").action(() => undoMove(vorpal));

  vorpal.command("s [index]", "Select file").action(async ({ index = 0 }) => {
    const filePath = fileFinder.mediaFiles({ recursive: true })[Number(index)];
    onGoToFile(filePath);
  });

  function getRandomFilePath({ filter, recursive }) {
    const mediaFiles = fileFinder.mediaFiles({ recursive, filter });
    const idx = Math.floor(Math.random() * mediaFiles.length);
    const filePath = mediaFiles[idx];
    if (filePath) {
      return filePath;
    } else {
      logger.log(`No files found (of total ${mediaFiles.length} files)`);
    }
  }

  vorpal
    .command("r [filter]", "Select random file (non recursive)")
    .action(async ({ filter }) => {
      const filePath = getRandomFilePath({ filter });
      if (filePath) {
        onGoToFile(filePath);
      }
    });

  vorpal
    .command("rr [filter]", "Select random file (recursive)")
    .action(async ({ filter }) => {
      const filePath = getRandomFilePath({ recursive: true, filter });
      if (filePath) {
        onGoToFile(filePath);
      }
    });

  vorpal.delimiter(`${chalk.yellow("mediamanage")} $`);

  return vorpal;
};
