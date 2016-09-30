const Promise = require('bluebird');

Promise.promisifyAll(require('fs'));
Promise.promisifyAll(require('mkdirp'));

const singleFileVorpal = require('./vorpals/single-file-vorpal');
const multiFileVorpal = require('./vorpals/multi-file-vorpal')(filePath => {
    singleFileVorpal(filePath, showMultiFile).show();
});

function showMultiFile() {
    multiFileVorpal.show();
}

showMultiFile();
