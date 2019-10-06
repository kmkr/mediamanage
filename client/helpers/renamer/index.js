const assert = require("assert");
const path = require("path");
const onProcessingRenamerHelper = require("./on-processing-renamer-helper");
const nonProcessingRenamerHelper = require("./non-processing-renamer-helper");

function isProcessed(fileName) {
  assert(fileName, `File name must be present. Was: ${fileName}`);
  const underscores = fileName.match(/_/g);

  if (!underscores || underscores.length < 2) {
    return false;
  }

  return !!nonProcessingRenamerHelper.getCategories(fileName).length;
}

module.exports = filePath => {
  const processed = isProcessed(path.parse(filePath).base);

  return processed ? nonProcessingRenamerHelper : onProcessingRenamerHelper;
};
