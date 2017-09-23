const path = require('path');
const performerNameList = require('../../performers/performer-name-list');
const currentFilePathStore = require('./current-file-path-store');
const categoriesAndPerformerNamesHandler = require('./categories-and-performer-names-handler');

function normalize(name) {
    return name.toLowerCase().replace(/[^a-z]/g, '');
}

module.exports = filePath => (
    new Promise(resolve => {
        const { name } = path.parse(filePath);
        const namesInFileTitle = performerNameList.list().filter(performerName => normalize(name).includes(normalize(performerName)));
        const newPath = categoriesAndPerformerNamesHandler(namesInFileTitle, filePath);
        currentFilePathStore.set(newPath);

        resolve();
    })
);
