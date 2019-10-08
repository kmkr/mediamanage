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
