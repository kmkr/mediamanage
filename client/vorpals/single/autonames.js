const path = require('path');
const performerNameList = require('../../performers/performer-name-list');
const currentFilePathStore = require('./current-file-path-store');
const categoriesAndPerformerNamesHandler = require('./categories-and-performer-names-handler');

module.exports = filePath => (
    new Promise(resolve => {
        const { name } = path.parse(filePath);
        const namesInFileTitle = performerNameList.list().filter(performerName => name.includes(performerName));
        const newPath = categoriesAndPerformerNamesHandler(namesInFileTitle, filePath);
        currentFilePathStore.set(newPath);

        resolve();
    })
);
