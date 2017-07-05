const Promise = require('bluebird');

Promise.promisifyAll(require('fs'));
Promise.promisifyAll(require('mkdirp'));

const singleFileVorpal = require('./vorpals/single-file-vorpal');

function showMultiFile() {
    const multiFileVorpal = require('./vorpals/multi-file-vorpal')(filePath => {
        const vorpalInstance = singleFileVorpal(filePath, showMultiFile);
        vorpalInstance.history('mediamanage-single');
        vorpalInstance.show();
    });
    multiFileVorpal.history('mediamanage-multi');
    multiFileVorpal.show();
}

showMultiFile();
