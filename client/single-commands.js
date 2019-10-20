const path = require("path");
const wuzbar = require("../wuzbar");
const config = require("./config.json");

const currentFilePathStore = require("./vorpals/single/current-file-path-store");
const mediaPlayer = require("./media-player");
const searchForExistingMedia = require("./existing-media-search/search-for-existing-media-service");
const buildExtractCommand = require("./vorpals/single/extract-command");
const deletePrompt = require("./vorpals/single/delete-prompt");
const setNamesCommand = require("./vorpals/single/set-performer-names-command");
const renameCommand = require("./vorpals/single/rename-file-command");
const setCategoriesCommand = require("./vorpals/single/set-categories-command");
const moveMedia = require("./move-media/move-media");

function getExtractCommands() {
  return config.extractOptions.map(extractOption => {
    return buildExtractCommand(extractOption);
  });
}

const returnToMultiSelectionSymbol = Symbol();

module.exports = filePath => {
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
            await deletePrompt();
            return returnToMultiSelectionSymbol;
          }
        },
        {
          prompt: "m",
          description: "Move file",
          handle: async () => {
            await moveMedia.single(currentFilePathStore.get());
            return returnToMultiSelectionSymbol;
          }
        },
        setNamesCommand(),
        renameCommand(),
        setCategoriesCommand(),
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
