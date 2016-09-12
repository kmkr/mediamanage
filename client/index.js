const singleFileVorpal = require('./vorpals/single-file-vorpal');
const multiFileVorpal = require('./vorpals/multi-file-vorpal')(fileName => {
    singleFileVorpal(fileName, showMultiFile).show();
});

function showMultiFile() {
    multiFileVorpal.show();
}

showMultiFile();
