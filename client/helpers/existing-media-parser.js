const path = require('path');

exports.getPerformerNames = filePath => {
    const fileName = path.parse(filePath).name;
    const withoutCategories = fileName.replace(/\[[^.]+/, '');
    const [, ...performerNames] = withoutCategories.split('_');

    return performerNames
        .filter(name => name);
};

exports.getTitle = filePath => path.parse(filePath).name.split('_')[0];
