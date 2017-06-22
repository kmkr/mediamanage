const Promise = require('bluebird');

Promise.promisifyAll(require('fs'));
Promise.promisifyAll(require('mkdirp'));

const singleFileVorpal = require('./vorpals/single-file-vorpal');
const multiFileVorpal = require('./vorpals/multi-file-vorpal')(filePath => {
    const vorpalInstance = singleFileVorpal(filePath, showMultiFile);
    vorpalInstance.history('mediamanage-single');
    vorpalInstance.show();
});

function showMultiFile() {
    multiFileVorpal.show();
}

multiFileVorpal.history('mediamanage-multi');

showMultiFile();
