const config = require("../../config.json");
const logger = require("../logger");
const fileFinder = require("../../file-system/finder");
const fileRenamer = require("../../file-system/renamer");
const removeCurrentWd = require("../../helpers/remove-current-wd");

module.exports = function(vorpal) {
  vorpal
    .command("addcat [filter]", "Multi add categories (recursive)")
    .action(({ filter }) => {
      const mediaFilePaths = fileFinder.mediaFiles({ recursive: true, filter });

      if (!mediaFilePaths.length) {
        logger.log("No files found");
        return Promise.resolve();
      }

      return vorpal.activeCommand
        .prompt({
          message: "Choose files",
          type: "checkbox",
          name: "filePaths",
          choices: mediaFilePaths.map(path => ({
            name: removeCurrentWd(path),
            value: path,
            checked: true
          }))
        })
        .then(({ filePaths }) => {
          if (!filePaths.length) {
            return;
          }

          return vorpal.activeCommand
            .prompt({
              message: "Enter categories",
              type: "checkbox",
              name: "categories",
              choices: config.categories
            })
            .then(({ categories }) => {
              if (categories && categories.length) {
                return vorpal.activeCommand
                  .prompt({
                    message: `Do you want to add ${categories.join(", ")}?`,
                    name: "confirmAdd",
                    type: "confirm"
                  })
                  .then(({ confirmAdd }) => {
                    if (!confirmAdd) {
                      return;
                    }

                    fileRenamer.addCategories(categories, filePaths);
                  });
              } else {
                logger.log("No category set");
              }
            });
        });
    });
};
