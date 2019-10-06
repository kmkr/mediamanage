const movedFiles = [];

exports.add = ({ sourceFilePath, destFilePath }) => {
  const timestamp = Date.now();
  movedFiles.push({ sourceFilePath, destFilePath, timestamp });
};

exports.get = () => {
  return [...movedFiles];
};
