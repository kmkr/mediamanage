const path = require("path");

const currentFilePathStore = require("./current-file-path-store");
const fileRenamer = require("../../file-system/renamer");
const logger = require("../logger");

module.exports = () => ({
  prompt: "rename [newName]",
  description: "Rename file",
  autocomplete() {
    return path.parse(currentFilePathStore.get()).name;
  },
  handle: async ({ newName }) => {
    if (newName) {
      const newPath = fileRenamer.rename(newName, currentFilePathStore.get());
      currentFilePathStore.set(newPath);
    } else {
      logger.log("No rename");
    }
  }
});
