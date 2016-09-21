const assert = require('assert');
const path = require('path');

const TITLE = /\(t:([\w\.]+)\)/;
const PERFORMERS = /\(p:([\w\._]+)\)/;
const CATEGORIES = /\(c:([\[\w\]]+)\)/;

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
        .replace(title, '')
        .replace(performers, '')
        .replace(categories, '')
        .replace(/_/g, '');

    const mainTitle = [title, performers, categories]
        .filter(e => e)
        .join('_');

    let prefix = '';

    if (directory === '/') {
        prefix = '/';
    } else if (directory) {
        prefix = `${directory}/`;
    }
    return `${prefix}${mainTitle}__${rest}`;
}

exports.cleanFileName = uncleaned => {
    const extension = path.extname(uncleaned);

    return uncleaned
        .replace(TITLE, (match, $1) => $1)
        .replace(PERFORMERS, (match, $1) => $1)
        .replace(CATEGORIES, (match, $1) => $1)
        .replace(/__.*/, extension);
};

function assertNotBlank(fileName) {
    assert(fileName, 'File name cannot be empty');
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
    const fileName = path.parse(filePath).base;
    const directory = path.parse(filePath).dir;

    if (hasPerformers(fileName)) {
        return normalize(directory, fileName.replace(PERFORMERS, `(p:${performers})`));
    }
    return normalize(directory, `(p:${performers})${fileName}`);
};

exports.setCategories = (categories, filePath) => {
    assertNotBlank(filePath);
    const fileName = path.parse(filePath).base;
    const directory = path.parse(filePath).dir;

    const categoryStr = `[${categories.join('][')}]`;
    if (hasCategories(fileName)) {
        return normalize(directory, fileName.replace(CATEGORIES, `(c:${categoryStr})`));
    }
    return normalize(directory, `(c:${categoryStr})${fileName}`);
};

exports.indexify = filePath => {
    assert(filePath, `File path cannot be empty. Was ${filePath}`);

    const extension = path.extname(filePath);
    const regExp = new RegExp(`\\((\\d+)\\)${extension}`);
    if (filePath.match(regExp)) {
        return filePath.replace(regExp, (match, $1) => {
            return `(${Number($1) + 1})${extension}`;
        });
    } else {
        return filePath.replace(extension, `_(1)${extension}`);
    }
};
