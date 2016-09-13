const fs = require('fs');
const path = require('path');

function isAudio(filePath) {
    return filePath.match(/\.(mp3|wav|wma|flac|ogg)$/i);
}

function isVideo(filePath) {
    return filePath.match(/\.(mkv|mp4|avi|mpeg|iso|wmv)$/i);
}

exports.video = (dirPath = process.cwd()) => {
    if (!path.isAbsolute(dirPath)) {
        dirPath = path.resolve(process.cwd(), dirPath);
    }
    return fs.readdirSync(dirPath)
        .filter(isVideo);
};

exports.audio = (dirPath = process.cwd()) => {
    if (!path.isAbsolute(dirPath)) {
        dirPath = path.resolve(process.cwd(), dirPath);
    }
    return fs.readdirSync(dirPath)
        .filter(isAudio);
};
