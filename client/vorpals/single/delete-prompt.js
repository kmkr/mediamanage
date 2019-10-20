const inquirer = require("inquirer");

const fileDeleter = require("../../file-system/deleter");
const currentFilePathStore = require("./current-file-path-store");

module.exports = async () => {
  const { confirmDelete } = await inquirer.prompt({
    message: "Delete file - are you sure?",
    type: "confirm",
    name: "confirmDelete"
  });

  if (confirmDelete) {
    await fileDeleter(currentFilePathStore.get());
  }
};
