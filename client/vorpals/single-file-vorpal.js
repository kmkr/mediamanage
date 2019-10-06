const Vorpal = require("vorpal");
const chalk = Vorpal().chalk; // eslint-disable-line new-cap
const path = require("path");
const Promise = require("bluebird");

const logger = require("./logger");

const currentFilePathStore = require("./single/current-file-path-store");
const mediaPlayer = require("../media-player");
const moveMedia = require("../move-media/move-media");

const fileDeleter = require("../file-system/deleter");

const removeCurrentWd = require("../helpers/remove-current-wd");
const config = require("../config.json");
const searchForExistingMedia = require("../existing-media-search/search-for-existing-media-service");

function run(onComplete) {
  const vorpal = new Vorpal();

  function setDelimiter() {
    const filePath = currentFilePathStore.get();
    const fileName = removeCurrentWd(filePath);

    vorpal.delimiter(`${chalk.green(fileName)} ${chalk.yellow("$")}`);
  }

  setDelimiter();
  vorpal.on("client_command_executed", ({ command }) => {
    if (command !== "n" && command !== "m") {
      setDelimiter();
    }
    logger.log("\n");
  });
  logger.setLogger(vorpal.log.bind(vorpal));

  require("./single/set-performer-names")(vorpal);
  require("./single/set-categories")(vorpal);
  require("./single/rename-file")(vorpal);

  config.extractOptions.forEach(extractOption => {
    require("./single/extract")(vorpal, extractOption);
  });

  vorpal.command("m", "Move file").action(async () => {
    await moveMedia.single(vorpal, currentFilePathStore.get());
    onComplete();
  });

  vorpal.command("d", "Delete file").action(() => {
    vorpal.activeCommand.prompt(
      {
        message: "Delete file - are you sure?",
        type: "confirm",
        name: "confirmDelete"
      },
      async function({ confirmDelete }) {
        if (confirmDelete) {
          await fileDeleter(currentFilePathStore.get());
        }
        onComplete();
      }
    );
  });

  vorpal.command("n", "Go back").action(async () => {
    onComplete();
  });

  return vorpal;
}

module.exports = function(filePath, onComplete) {
  currentFilePathStore.set(filePath);
  mediaPlayer.play(currentFilePathStore.get());

  searchForExistingMedia(path.parse(filePath).name);

  return run(() => {
    mediaPlayer.stop();
    onComplete();
    currentFilePathStore.unset();
  });
};
