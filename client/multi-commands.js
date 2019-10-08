const wuzbar = require("../wuzbar");
const getRandomFilePath = require("./get-random-file-path");
const fileNamesLogger = require("./vorpals/multi/file-names-logger");

module.exports = ({ onSelectFile }) => {
  fileNamesLogger("*");
  return wuzbar({
    prompt: "mm",
    commands: [
      {
        prompt: "r [filter]",
        handle({ filter }) {
          return onSelectFile(getRandomFilePath({ filter }));
        }
      }
    ],
    context: 0
  });
};
