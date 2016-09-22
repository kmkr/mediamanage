const assert = require('assert');
const path = require('path');
const fs = require('fs');

const indexifyIfExists = require('../file-system/indexify-if-exists');
const secondsFromStringParser = require('./seconds-from-string-parser');

const extractors = [
    require('./ffmpeg-extractor')
];

function mkdir(dirName) {
    try {
        fs.mkdirSync(dirName);
    } catch (e) {
        if (e.code !== 'EEXIST') {
            throw e;
        }
    }
}

function map(from, to) {
    const startsAtSeconds = secondsFromStringParser(`${from}`);
    const endsAtSeconds = secondsFromStringParser(`${to}`);

    if (typeof startsAtSeconds === 'undefined' || !endsAtSeconds || startsAtSeconds > endsAtSeconds) {
        throw new Error(`Something is wrong with from ${from} ${to}`);
    }

    return {
        startsAtSeconds,
        endsAtSeconds
    };
}

exports.extractVideo = ({destinationDir, filePath, from, to}) => {
    const extractor = extractors.find(extractor => extractor.supportsVideo(filePath));

    if (!extractor) {
        throw new Error(`Unable to find extractor for ${filePath}`);
    }

    const {startsAtSeconds, endsAtSeconds} = map(from, to);
    const destFilePath = getDestFilePath(destinationDir, filePath);
    mkdir(destinationDir);
    return extractor.extractVideo({
        sourceFilePath: filePath,
        destFilePath,
        startsAtSeconds,
        endsAtSeconds
    }).then(() => {
        return {destFilePath};
    });
};

exports.extractAudio = ({destinationDir, filePath, from, to}) => {
    const extractor = extractors.find(extractor => extractor.supportsAudio(filePath));

    if (!extractor) {
        throw new Error(`Unable to find extractor for ${filePath}`);
    }

    const {startsAtSeconds, endsAtSeconds} = map(from, to);
    const destFilePath = getDestFilePath(destinationDir, filePath, '.mp3');
    mkdir(destinationDir);
    return extractor.extractAudio({
        sourceFilePath: filePath,
        destFilePath,
        startsAtSeconds,
        endsAtSeconds
    }).then(() => {
        return {destFilePath};
    });
};

function getDestFilePath(destinationDir, sourceFilePath, fileExtension) {
    let fileName = path.parse(sourceFilePath).base;
    if (fileExtension) {
        fileName = fileName.replace(path.extname(fileName), fileExtension);
    }

    const destFilePath = path.resolve(destinationDir, fileName);
    return indexifyIfExists(destFilePath);
}
