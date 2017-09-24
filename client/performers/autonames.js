const path = require('path');
const performerNameList = require('./performer-name-list');
const categoriesAndPerformerNamesHandler = require('./categories-and-performer-names-handler');

function normalize(name) {
    return name.toLowerCase().replace(/[^a-z]/g, '');
}

module.exports = filePath => {
    const { name } = path.parse(filePath);
    const namesInFileTitle = performerNameList.list().filter(performerName => normalize(name).includes(normalize(performerName)));
    const newPath = categoriesAndPerformerNamesHandler(namesInFileTitle, filePath);
    return newPath;
};
