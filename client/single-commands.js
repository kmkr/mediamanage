const path = require("path");
const wuzbar = require("../wuzbar");
const config = require("./config.json");

const currentFilePathStore = require("./vorpals/single/current-file-path-store");
const mediaPlayer = require("./media-player");
const searchForExistingMedia = require("./existing-media-search/search-for-existing-media-service");
const buildExtractCommand = require("./vorpals/single/extract");
const handleDeleteCommand = require("./vorpals/single/delete");
const removeCurrentWd = require("./helpers/remove-current-wd");

function getExtractCommands() {
  return config.extractOptions.map(extractOption => {
    return buildExtractCommand(extractOption);
  });
}

const returnToMultiSelectionSymbol = Symbol();

module.exports = (filePath, handleBack) => {
  currentFilePathStore.set(filePath);
  mediaPlayer.play(currentFilePathStore.get());
  searchForExistingMedia(path.parse(filePath).name);

  async function prompt() {
    const result = await wuzbar({
      prompt: ">>",
      commands: [
        {
          prompt: "n",
          description: "Go back",
          handle() {
            return returnToMultiSelectionSymbol;
          }
        },
        {
          prompt: "d",
          description: "Delete file",
          handle: async () => {
            await handleDeleteCommand();
            return returnToMultiSelectionSymbol;
          }
        },

        ...getExtractCommands()
      ],
      context: 1
    });
    if (result === returnToMultiSelectionSymbol) {
      mediaPlayer.stop();
      return;
    }
    return prompt();
  }

  return prompt();
};
