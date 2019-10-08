const path = require("path");
const wuzbar = require("../wuzbar");
const config = require("./config.json");

const currentFilePathStore = require("./vorpals/single/current-file-path-store");
const mediaPlayer = require("./media-player");
const searchForExistingMedia = require("./existing-media-search/search-for-existing-media-service");
const buildExtractCommand = require("./vorpals/single/extract");
const handleDeleteCommand = require("./vorpals/single/delete");

function getExtractCommands() {
  return config.extractOptions.map(extractOption => {
    return buildExtractCommand(extractOption);
  });
}

const returnToMultiSelectionSymbol = Symbol();

module.exports = (filePath, handleBack) => {
  console.log("Play file", filePath);
  currentFilePathStore.set(filePath);
  mediaPlayer.play(currentFilePathStore.get());
  searchForExistingMedia(path.parse(filePath).name);

  async function prompt() {
    const result = await wuzbar({
      prompt: filePath,
      commands: [
        {
          prompt: "n",
          handle() {
            mediaPlayer.stop();
            return returnToMultiSelectionSymbol;
          }
        },
        {
          prompt: "d",
          handle() {
            return handleDeleteCommand();
          }
        },

        ...getExtractCommands()
      ],
      context: 1
    });
    if (result === returnToMultiSelectionSymbol) {
      return;
    }
    return prompt();
  }

  return prompt();
};
