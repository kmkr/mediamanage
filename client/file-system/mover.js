const assert = require("assert");
const fs = require("fs");
const path = require("path");

const printPathsService = require("../helpers/print-paths-service");
const movedFiles = require("./moved-files-service");

module.exports = (sourceFilePath, destFilePath) => {
  assert(
    path.isAbsolute(sourceFilePath),
    `Source must be absolute. Was: ${sourceFilePath}`
  );
  assert(
    path.isAbsolute(destFilePath),
    `Dest must be absolute. Was: ${destFilePath}`
  );

  fs.renameSync(sourceFilePath, destFilePath);
  movedFiles.add({ sourceFilePath, destFilePath });
  printPathsService.asPairsOfLists({
    sourceFilePaths: [sourceFilePath],
    destFilePaths: [destFilePath]
  });
  return destFilePath;
};
