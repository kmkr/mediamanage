const fs = require('fs');
const klawSync = require('klaw-sync');
const path = require('path');
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

function isAudio(filePath) {
    return filePath.match(/\.(mp3|wav|wma|flac|ogg)$/i);
}

function isVideo(filePath) {
    return filePath.match(/\.(mkv|mp4|avi|mpeg|iso|wmv|m2ts)$/i);
}

function allFiles({ dirPath = process.cwd(), recursive = false } = {}) {
    if (!path.isAbsolute(dirPath)) {
        dirPath = path.resolve(dirPath);
    }

    let files;

    if (recursive) {
        files = klawSync(dirPath).map(({ path }) => path);
    } else {
        files = fs.readdirSync(dirPath)
            .map(fileName => path.resolve(process.cwd(), dirPath, fileName));
    }

    return files.sort(collator.compare);
}

exports.allFiles = allFiles;

exports.mediaFiles = ({ dirPath = process.cwd(), recursive = false }) => {
    return allFiles({ dirPath, recursive }).filter(filePath => (
        isAudio(filePath) || isVideo(filePath)
    ));
};

exports.video = ({ dirPath = process.cwd(), recursive = false, filter = '' } = {}) => {
    return allFiles({ dirPath, recursive, filter }).filter(isVideo);
};

exports.audio = ({ dirPath = process.cwd(), recursive = false, filter = '' } = {}) => {
    return allFiles({ dirPath, recursive, filter }).filter(isAudio);
};
