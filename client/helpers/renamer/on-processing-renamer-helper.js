const assert = require("assert");
const path = require("path");
const {
  parseCategoriesAsArrayStr
} = require("../categories-as-array-str-helper");

const TITLE = /\(t:([^)]+)\)/;
const PERFORMERS = /\(p:([\w._]+)\)/;
const CATEGORIES = /\(c:([[\w\-\]]+)\)/;
const INDEX = /_\((\d+)\)/;

function hasTitle(fileName) {
  return fileName.match(TITLE);
}

function hasPerformers(fileName) {
  return fileName.match(PERFORMERS);
}

function hasCategories(fileName) {
  return fileName.match(CATEGORIES);
}

function normalize(directory, fileName) {
  const title = (fileName.match(TITLE) || [])[0];
  const performers = (fileName.match(PERFORMERS) || [])[0];
  const categories = (fileName.match(CATEGORIES) || [])[0];
  const rest = fileName
    .replace(title, "")
    .replace(performers, "")
    .replace(categories, "")
    .replace(/^_+/, "");

  const mainTitle = [title, performers, categories].filter(e => e).join("_");

  let prefix = "";

  if (directory === path.sep) {
    prefix = path.sep;
  } else if (directory) {
    prefix = `${directory}${path.sep}`;
  }
  return `${prefix}${mainTitle}__${rest}`;
}

exports.cleanFilePath = uncleanedFilePath => {
  const fileDir = path.parse(uncleanedFilePath).dir;
  const uncleanedFileName = path.parse(uncleanedFilePath).base;
  const fileExtension = path.extname(uncleanedFileName);
  const titleIsSet = hasTitle(uncleanedFileName);

  let cleanedFileName = uncleanedFileName
    .replace(PERFORMERS, (match, $1) => $1)
    .replace(CATEGORIES, (match, $1) => $1);

  if (titleIsSet) {
    // Remove the original file name and use the title instead
    const withSetTitle = cleanedFileName
      .replace(TITLE, (match, $1) => $1)
      .replace(/__.*/, fileExtension);

    return path.join(fileDir, withSetTitle);
  }

  cleanedFileName = cleanedFileName.replace(fileExtension, "");

  // Title is not set and the original file name will be used as title.
  // Move it to the start of the file name
  if (cleanedFileName.includes("__")) {
    let [firstPart, secondPart] = cleanedFileName.split("__"); // eslint-disable-line prefer-const

    // If the original file is indexed, remove the index
    const indexMatch = secondPart.match(INDEX);
    if (indexMatch) {
      secondPart = secondPart.replace(indexMatch[0], "");
    }
    return path.join(fileDir, `${secondPart}_${firstPart}${fileExtension}`);
  }

  return path.join(fileDir, cleanedFileName + fileExtension);
};

function assertNotBlank(fileName) {
  assert(fileName, "File path cannot be empty");
}

exports.setTitle = (title, filePath) => {
  assertNotBlank(filePath);
  const fileName = path.parse(filePath).base;
  const directory = path.parse(filePath).dir;

  if (hasTitle(fileName)) {
    return normalize(directory, fileName.replace(TITLE, `(t:${title})`));
  }
  return normalize(directory, `(t:${title})${fileName}`);
};

exports.setPerformerNames = (performers, filePath) => {
  assertNotBlank(filePath);
  assert(
    performers.constructor === Array,
    `Performers must be an array. Was ${performers}`
  );
  const performersStr = performers.join("_");
  const fileName = path.parse(filePath).base;
  const directory = path.parse(filePath).dir;

  if (hasPerformers(fileName)) {
    return normalize(
      directory,
      fileName.replace(PERFORMERS, `(p:${performersStr})`)
    );
  }
  return normalize(directory, `(p:${performersStr})${fileName}`);
};

exports.setCategories = (categories, filePath) => {
  assertNotBlank(filePath);
  const fileName = path.parse(filePath).base;
  const directory = path.parse(filePath).dir;

  const categoryStr = categoriesAsStr(categories);
  if (hasCategories(fileName)) {
    return normalize(
      directory,
      fileName.replace(CATEGORIES, `(c:${categoryStr})`)
    );
  }
  return normalize(directory, `(c:${categoryStr})${fileName}`);
};

exports.indexify = filePath => {
  assertNotBlank(filePath);

  const extension = path.extname(filePath);
  const regExp = new RegExp(`${INDEX.source}${extension}`);
  if (filePath.match(regExp)) {
    return filePath.replace(regExp, (match, $1) => {
      return `_(${Number($1) + 1})${extension}`;
    });
  } else {
    return filePath.replace(extension, `_(1)${extension}`);
  }
};

function categoriesAsStr(categories) {
  return `[${categories.join("][")}]`;
}

exports.categoriesAsStr = categoriesAsStr;
exports.getCategories = filePath => {
  assertNotBlank(filePath);

  const fileName = path.parse(filePath).name;

  return parseCategoriesAsArrayStr((hasCategories(fileName) || [])[1]);
};
