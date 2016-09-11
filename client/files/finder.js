const fs = require('fs');

function isAudio(filePath) {
    return filePath.match(/\.(mp3|wav|wma|flac|ogg)$/i);
}

function isVideo(filePath) {
    return filePath.match(/\.(mkv|mp4|avi|mpeg|iso|wmv)$/i);
}

exports.video = (path = process.cwd()) => {
    return fs.readdirSync(path)
        .filter(isVideo);
};

exports.audio = (path = process.cwd()) => {
    return fs.readdirSync(path)
        .filter(isAudio);
};
