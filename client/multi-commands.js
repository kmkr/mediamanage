const wuzbar = require("../wuzbar");
const getRandomFilePath = require("./get-random-file-path");
const fileNamesLogger = require("./vorpals/multi/file-names-logger");
const moveMedia = require("./move-media/move-media");
const undoMove = require("./move-media/undo-move");
const fileFinder = require("./file-system/finder");
const cleanDirectory = require("./clean-directory");

module.exports = ({ onSelectFile }) => {
  fileNamesLogger("*");
  async function prompt() {
    await wuzbar({
      prompt: ">",
      commands: [
        {
          prompt: "s [index]",
          description: "Select file",
          handle({ index = 0 }) {
            const filePath = fileFinder.mediaFiles({ recursive: true })[
              Number(index)
            ];
            return onSelectFile(filePath);
          }
        },
        {
          prompt: "r [filter]",
          description: "Select random file (non recursive)",
          handle({ filter }) {
            return onSelectFile(getRandomFilePath({ filter }));
          }
        },
        {
          prompt: "rr [filter]",
          description: "Select random file (recursive)",
          handle({ filter }) {
            return onSelectFile(getRandomFilePath({ filter, recursive: true }));
          }
        },
        {
          prompt: "l [filter]",
          description:
            'List media. Filter is a minimatch pattern. Defaults to "*".',
          handle({ filter = "*" }) {
            return fileNamesLogger(filter);
          }
        },
        {
          prompt: "ll",
          description: "List recursive media.",
          handle() {
            return fileNamesLogger("**/**");
          }
        },
        {
          prompt: "m",
          description: "Move files",
          handle: async () => {
            await moveMedia.all();
            cleanDirectory();
          }
        },
        {
          prompt: "u",
          description: "Undo move",
          handle: async () => {
            await undoMove();
          }
        }
      ],
      context: 0
    });

    return prompt();
  }
  return prompt();
};
