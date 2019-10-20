const inquirer = require("inquirer");
const config = require("../../config.json");
const currentFilePathStore = require("./current-file-path-store");
const fileRenamer = require("../../file-system/renamer");
const logger = require("../logger");

module.exports = () => ({
  prompt: "cat",
  description: "Set categories",
  handle: async () => {
    const { categories } = await inquirer.prompt({
      message: "Enter categories",
      type: "checkbox",
      name: "categories",
      choices: config.categories
    });
    if (categories && categories.length) {
      const [newPath] = fileRenamer.setCategories(categories, [
        currentFilePathStore.get()
      ]);
      currentFilePathStore.set(newPath);
    } else {
      logger.log("No category set");
    }
  }
});
