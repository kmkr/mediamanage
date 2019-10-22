const config = require("../../config.json");
const currentFilePathStore = require("./current-file-path-store");
const performerNameList = require("../../performers/performer-name-list");
const categoriesAndPerformerNamesHandler = require("../../performers/categories-and-performer-names-handler");

module.exports = () => ({
  prompt: "names <names>",
  description: "Set performer names and/or categories",
  autocomplete() {
    return config.categories.concat(performerNameList.list());
  },
  handle: async ({ names }) => {
    const performerNamesAndCategories = names.split(" ");
    const newPath = categoriesAndPerformerNamesHandler(
      performerNamesAndCategories,
      currentFilePathStore.get()
    );
    currentFilePathStore.set(newPath);
  }
});
