const path = require('path');
const fs = require('fs');

const indexifyIfExists = require('../file-system/indexify-if-exists');
const timeAtGetter = require('./time-at-getter');

const extractors = [
    require('./ffmpeg-extractor')
];

exports.extractFormat = 'Start at and ends at in format <performerinfo@>hh:mm:ss hh:mm:ss';
exports.extractFormatValidator = input => {
    if (!input) {
        return true;
    }
    if (!input.match(/\s/)) {
        return false;
    }
    const {performerInfo, startsAtSeconds, endsAtSeconds} = timeAtGetter(input);
    if (!startsAtSeconds || !endsAtSeconds || startsAtSeconds > endsAtSeconds) {
        return false;
    }

    return true;
};

function mkdir(dirName) {
    try {
        fs.mkdirSync(dirName);
    } catch (e) {
        if (e.code !== 'EEXIST') {
            throw e;
        }
    }
}

exports.extractVideo = ({destinationDir, filePath, extractPoint}) => {
    const extractor = extractors.find(extractor => extractor.supportsVideo(filePath));

    if (!extractor) {
        throw new Error(`Unable to find extractor for ${filePath}`);
    }

    const {performerInfo, startsAtSeconds, endsAtSeconds} = timeAtGetter(extractPoint);
    // todo: handle performer info
    const destFilePath = getDestFilePath(destinationDir, filePath);
    mkdir(destinationDir);
    return extractor.extractVideo({
        sourceFilePath: filePath,
        destFilePath,
        startsAtSeconds,
        endsAtSeconds
    });
};

exports.extractAudio = ({destinationDir, filePath, extractPoint}) => {
    const extractor = extractors.find(extractor => extractor.supportsAudio(filePath));

    if (!extractor) {
        throw new Error(`Unable to find extractor for ${filePath}`);
    }

    const {performerInfo, startsAtSeconds, endsAtSeconds} = timeAtGetter(extractPoint);
    // todo: handle performer info
    const destFilePath = getDestFilePath(destinationDir, filePath, '.mp3');
    mkdir(destinationDir);
    return extractor.extractAudio({
        sourceFilePath: filePath,
        destFilePath,
        startsAtSeconds,
        endsAtSeconds
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
