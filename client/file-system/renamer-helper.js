const TITLE = /\(t:[\w\.]+\)/;
const PERFORMERS = /\(p:[\w\._]+\)/;
const CATEGORIES = /\(c:[\[\w\]]+\)/;

function hasTitle(fileName) {
    return fileName.match(TITLE);
}

function hasPerformers(fileName) {
    return fileName.match(PERFORMERS);
}

function hasCategories(fileName) {
    return fileName.match(CATEGORIES);
}

function normalize(fileName) {
    const title = fileName.match(TITLE);
    const performers = fileName.match(PERFORMERS);
    const categories = fileName.match(CATEGORIES);
    const rest = fileName
        .replace(title, '')
        .replace(performers, '')
        .replace(categories, '')
        .replace(/_/g, '');

    const mainTitle = [title, performers, categories]
        .filter(e => e)
        .join('_');

    return `${mainTitle}__${rest}`;
}

exports.setTitle = (title, fileName) => {
    if (hasTitle(fileName)) {
        return normalize(fileName.replace(TITLE, `(t:${title})`));
    }
    return normalize(`(t:${title})${fileName}`);
};

exports.setPerformerNames = (performers, fileName) => {
    if (hasPerformers(fileName)) {
        return normalize(fileName.replace(PERFORMERS, `(p:${performers})`));
    }
    return normalize(`(p:${performers})${fileName}`);
};

exports.setCategories = (categories, fileName) => {
    const categoryStr = `[${categories.join('][')}]`;
    if (hasCategories(fileName)) {
        return normalize(fileName.replace(CATEGORIES, `(c:${categoryStr})`));
    }
    return normalize(`(c:${categoryStr})${fileName}`);
};
