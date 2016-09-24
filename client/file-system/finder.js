const fs = require('fs');
// todo: fjern denne avhengigheten (utdatert)
// vurder https://www.npmjs.com/package/fs-extra
const fsTools = require('fs-tools');
const path = require('path');

function isAudio(filePath) {
    return filePath.match(/\.(mp3|wav|wma|flac|ogg)$/i);
}

function isVideo(filePath) {
    return filePath.match(/\.(mkv|mp4|avi|mpeg|iso|wmv)$/i);
}

function allFiles({dirPath = process.cwd(), recursive = false} = {}) {
    if (!path.isAbsolute(dirPath)) {
        dirPath = path.resolve(dirPath);
    }

    if (recursive) {
        const files = [];
        fsTools.walkSync(dirPath, filePath => {
            files.push(filePath);
        });
        return files;
    }

    return fs.readdirSync(dirPath).map(fileName => path.resolve(process.cwd(), dirPath, fileName));
}

exports.allFiles = allFiles;

exports.mediaFiles = ({dirPath = process.cwd(), recursive = false}) => {
    return allFiles({dirPath, recursive}).filter(filePath => {
        return isAudio(filePath) || isVideo(filePath);
    });
};

exports.video = ({dirPath = process.cwd(), recursive = false} = {}) => {
    return allFiles({dirPath, recursive}).filter(isVideo);
};

exports.audio = ({dirPath = process.cwd(), recursive = false} = {}) => {
    return allFiles({dirPath, recursive}).filter(isAudio);
};
