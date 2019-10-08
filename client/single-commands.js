const path = require("path");
const wuzbar = require("../wuzbar");

const currentFilePathStore = require("./vorpals/single/current-file-path-store");
const mediaPlayer = require("./media-player");
const searchForExistingMedia = require("./existing-media-search/search-for-existing-media-service");

module.exports = (filePath, handleBack) => {
  console.log("Play file", filePath);
  currentFilePathStore.set(filePath);
  mediaPlayer.play(currentFilePathStore.get());
  searchForExistingMedia(path.parse(filePath).name);

  function prompt() {
    return wuzbar({
      prompt: filePath,
      commands: [
        {
          prompt: "n",
          handle() {
            mediaPlayer.stop();
            return -1;
          }
        },
        {
          prompt: "t [...something]",
          handle({ filter }) {
            return new Promise(resolve => {
              console.log("Extract complete");
              setTimeout(resolve, 1500);
            });
          }
        }
      ],
      context: 1
    }).then(exitCode => {
      if (exitCode !== -1) {
        return prompt();
      }
    });
  }

  return prompt();
};
