const wuzbar = require("../wuzbar");
const getRandomFilePath = require("./get-random-file-path");
const fileNamesLogger = require("./vorpals/multi/file-names-logger");
const moveMedia = require("./move-media/move-media");
const fileFinder = require("./file-system/finder");

module.exports = ({ onSelectFile }) => {
  fileNamesLogger("*");
  async function prompt() {
    const result = await wuzbar({
      prompt: "mm",
      commands: [
        {
          prompt: "s [index]",
          handle({ index = 0 }) {
            const filePath = fileFinder.mediaFiles({ recursive: true })[
              Number(index)
            ];
            return onSelectFile(filePath);
          }
        },
        {
          prompt: "r [filter]",
          handle({ filter }) {
            return onSelectFile(getRandomFilePath({ filter }));
          }
        },
        {
          prompt: "l [filter]",
          handle({ filter = "*" }) {
            return fileNamesLogger(filter);
          }
        },
        {
          prompt: "ll",
          handle() {
            return fileNamesLogger("**/**");
          }
        },
        {
          prompt: "m",
          handle() {
            return moveMedia.all();
          }
        }
      ],
      context: 0
    });

    return prompt();
  }
  return prompt();
};
