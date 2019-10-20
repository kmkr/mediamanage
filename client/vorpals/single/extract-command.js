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
const { setPrompt } = require("../../../wuzbar/wuzbar-prompt");

let autoFillData;

function extractToTime(toAndPerformerNamesAndCategories) {
  const TIME_REGEXP = /^[\d\W]+$/i;
  const to = toAndPerformerNamesAndCategories.find(e => e.match(TIME_REGEXP));
  const performerNamesAndCategories = toAndPerformerNamesAndCategories.filter(
    e => e !== to
  );

  return { performerNamesAndCategories, to };
}

module.exports = extractOption => {
  const { commandKey, destination, replaceFile, type } = extractOption;
  const commandPrompt = `${commandKey} [from] [toAndPerformerNamesAndCategories...]`;

  return {
    prompt: commandPrompt,
    description: `Extract to ${destination}`,
    validate({ from, toAndPerformerNamesAndCategories = [] }) {
      if (!from) {
        return "Missing required 'from' argument";
      }
      const { performerNamesAndCategories, to } = extractToTime(
        toAndPerformerNamesAndCategories
      );
      const isValid = validate({ from, to, performerNamesAndCategories });
      autoFillData = {
        from,
        to,
        performerNamesAndCategories
      };
      if (!isValid) {
        return "Invalid input";
      }
      return true;
    },
    autocomplete() {
      return config.categories.concat(performerNameList.list());
    },
    handle: async ({ from, toAndPerformerNamesAndCategories = [] }) => {
      const { performerNamesAndCategories, to } = extractToTime(
        toAndPerformerNamesAndCategories
      );
      const extractFunction = type === "video" ? extractVideo : extractAudio;
      const trimmedPerformerNamesAndCategories = performerNamesAndCategories.map(
        entry => entry.trim()
      );

      const filePath = currentFilePathStore.get();

      const {
        destFilePath,
        secondsRemaining,
        totalSeconds
      } = await extractFunction({
        destinationDir: destination,
        filePath,
        from,
        to
      });
      logger.log("Extraction complete");

      const tempFilePath = categoriesAndPerformerNamesHandler(
        trimmedPerformerNamesAndCategories,
        destFilePath
      );

      if (replaceFile) {
        throw new Error("NYI");
        // const { confirmReplace } = await vorpal.activeCommand.prompt({
        //   message: `Do you want to replace ${chalk.yellow(
        //     removeCurrentWd(filePath)
        //   )} with ${removeCurrentWd(tempFilePath)}?`,
        //   name: "confirmReplace",
        //   type: "confirm"
        // });

        // if (confirmReplace) {
        //   const filePathWithUpdates = categoriesAndPerformerNamesHandler(
        //     trimmedPerformerNamesAndCategories,
        //     filePath
        //   );
        //   mover(tempFilePath, filePath);
        //   if (filePathWithUpdates !== filePath) {
        //     logger.log(
        //       "Adding changes in categories / performer names to file ..."
        //     );
        //     mover(filePath, filePathWithUpdates);
        //     currentFilePathStore.set(filePathWithUpdates);
        //   }
        // }
      }

      let { startsAtSeconds, endsAtSeconds } = mapToSeconds(
        autoFillData.from,
        autoFillData.to
      );
      const previousRangeSpan = endsAtSeconds - startsAtSeconds;
      const time = secondsToTimeParser(
        Math.min(totalSeconds, endsAtSeconds + previousRangeSpan)
      );
      if (secondsRemaining > 60) {
        setTimeout(() => {
          const autoFillInput = [autoFillData.to, time]
            .concat(autoFillData.performerNamesAndCategories)
            .join(" ");
          setPrompt(`${commandKey} ${autoFillInput} `);
        }, 10);
      }
    }
  };
};
