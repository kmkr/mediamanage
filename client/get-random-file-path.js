const fileFinder = require("./file-system/finder");
const logger = require("./vorpals/logger");

module.exports = ({ filter, recursive }) => {
  const mediaFiles = fileFinder.mediaFiles({ recursive, filter });
  const idx = Math.floor(Math.random() * mediaFiles.length);
  const filePath = mediaFiles[idx];
  if (filePath) {
    return filePath;
  } else {
    logger.log(`No files found (of total ${mediaFiles.length} files)`);
  }
};
