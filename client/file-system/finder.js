const fs = require('fs');
const path = require('path');

function isAudio(filePath) {
    return filePath.match(/\.(mp3|wav|wma|flac|ogg)$/i);
}

function isVideo(filePath) {
    return filePath.match(/\.(mkv|mp4|avi|mpeg|iso|wmv)$/i);
}

// todo: vurder å alltid gi full path her
exports.video = (dirPath = process.cwd()) => {
    if (!path.isAbsolute(dirPath)) {
        dirPath = path.resolve(dirPath);
    }
    return fs.readdirSync(dirPath)
        .filter(isVideo);
};

// todo: vurder å alltid gi full path her
exports.audio = (dirPath = process.cwd()) => {
    if (!path.isAbsolute(dirPath)) {
        dirPath = path.resolve(dirPath);
    }
    return fs.readdirSync(dirPath)
        .filter(isAudio);
};
