const chalk = require("chalk");
const config = require("../../config.json");
const currentFilePathStore = require("./current-file-path-store");
const {
  extractAudio,
  extractVideo,
  validate,
  mapToSeconds
} = require("../../media-extract");
const secondsToTimeParser = require("../../media-extract/seconds-to-time-parser")(
  { separator: ".", padZeros: false, trimStart: true }
);
const logger = require("../logger");
const performerNameList = require("../../performers/performer-name-list");
const categoriesAndPerformerNamesHandler = require("../../performers/categories-and-performer-names-handler");
const mover = require("../../file-system/mover");
const removeCurrentWd = require("../../helpers/remove-current-wd");

let autoFillData;

function extractToTime(toAndPerformerNamesAndCategories) {
  const TIME_REGEXP = /^[\d\W]+$/i;
  const to = toAndPerformerNamesAndCategories.find(e => e.match(TIME_REGEXP));
  const performerNamesAndCategories = toAndPerformerNamesAndCategories.filter(
    e => e !== to
  );

  return { performerNamesAndCategories, to };
}

module.exports = (vorpal, extractOption) => {
  const { commandKey, destination, replaceFile, type } = extractOption;
  const commandPrompt = `${commandKey} <from> [toAndPerformerNamesAndCategories...]`;

  vorpal
    .command(commandPrompt, `Extract to ${destination}`)
    .types({
      string: ["_"]
    })
    .validate(({ from, toAndPerformerNamesAndCategories = [] }) => {
      const { performerNamesAndCategories, to } = extractToTime(
        toAndPerformerNamesAndCategories
      );
      const isValid = validate({ from, to, performerNamesAndCategories });
      if (!isValid) {
        logger.log("Invalid input");
      }

      autoFillData = {
        from,
        to,
        performerNamesAndCategories
      };
      return isValid;
    })
    .autocomplete({
      data: () => config.categories.concat(performerNameList.list())
    })
    .action(({ from, toAndPerformerNamesAndCategories = [] }) => {
      const { performerNamesAndCategories, to } = extractToTime(
        toAndPerformerNamesAndCategories
      );
      const fn = type === "video" ? extractVideo : extractAudio;
      const trimmedPerformerNamesAndCategories = performerNamesAndCategories.map(
        entry => entry.trim()
      );

      const filePath = currentFilePathStore.get();

      return fn({
        destinationDir: destination,
        filePath,
        from,
        to
      }).then(
        ({ destFilePath: tempFilePath, secondsRemaining, totalSeconds }) => {
          logger.log("Extraction complete");

          tempFilePath = categoriesAndPerformerNamesHandler(
            trimmedPerformerNamesAndCategories,
            tempFilePath
          );

          if (replaceFile) {
            return vorpal.activeCommand
              .prompt({
                message: `Do you want to replace ${chalk.yellow(
                  removeCurrentWd(filePath)
                )} with ${removeCurrentWd(tempFilePath)}?`,
                name: "confirmReplace",
                type: "confirm"
              })
              .then(({ confirmReplace }) => {
                if (!confirmReplace) {
                  return;
                }

                const filePathWithUpdates = categoriesAndPerformerNamesHandler(
                  trimmedPerformerNamesAndCategories,
                  filePath
                );
                mover(tempFilePath, filePath);
                if (filePathWithUpdates !== filePath) {
                  logger.log(
                    "Adding changes in categories / performer names to file ..."
                  );
                  mover(filePath, filePathWithUpdates);
                  currentFilePathStore.set(filePathWithUpdates);
                }
              });
          }

          const { from, to, performerNamesAndCategories } = autoFillData;
          let { startsAtSeconds, endsAtSeconds } = mapToSeconds(from, to);
          const previousRangeSpan = endsAtSeconds - startsAtSeconds;
          const time = secondsToTimeParser(
            Math.min(totalSeconds, endsAtSeconds + previousRangeSpan)
          );
          if (secondsRemaining > 60) {
            setTimeout(() => {
              const autoFillInput = [to, time]
                .concat(performerNamesAndCategories)
                .join(" ");
              vorpal.ui.input(`${commandKey} ${autoFillInput} `);
            }, 10);
          }
        }
      );
    });
};
