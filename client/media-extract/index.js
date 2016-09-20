const path = require('path');
const fs = require('fs');

const {cleanFileName} = require('../file-system/renamer-helper');
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
    extractor.extractVideo({
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
    extractor.extractAudio({
        sourceFilePath: filePath,
        destFilePath,
        startsAtSeconds,
        endsAtSeconds
    });
};

function getDestFilePath(destinationDir, sourceFilePath, fileExtension) {
    const fileName = path.parse(sourceFilePath).base;
    let cleanedFileName = cleanFileName(fileName);
    if (fileExtension) {
        cleanedFileName = cleanedFileName.replace(path.extname(cleanedFileName), fileExtension);
    }

    const destFilePath = path.resolve(destinationDir, cleanedFileName);
    return indexifyIfExists(destFilePath);
}
