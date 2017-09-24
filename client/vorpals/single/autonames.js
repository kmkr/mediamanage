const currentFilePathStore = require('./current-file-path-store');
const autonames = require('../../performers/autonames');

module.exports = filePath => (
    new Promise(resolve => {
        const newPath = autonames(filePath);
        currentFilePathStore.set(newPath);
        resolve();
    })
);
