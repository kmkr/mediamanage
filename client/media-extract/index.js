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
    if (!input || !input.match(/\s/)) {
        return false;
    }
    const {performerInfo, startsAtSeconds, endsAtSeconds} = timeAtGetter(input);
    if (!startsAtSeconds || !endsAtSeconds || startsAtSeconds > endsAtSeconds) {
        return false;
    }

    return true;
};

exports.extractVideo = ({destinationDir, fileName, extractPoint}) => {
    const extractor = extractors.find(extractor => extractor.supportsVideo(fileName));

    if (!extractor) {
        throw new Error(`Unable to find extractor for ${fileName}`);
    }

    const {performerInfo, startsAtSeconds, endsAtSeconds} = timeAtGetter(extractPoint);
    // todo: handle performer info
    const destFilePath = getDestFilePath(destinationDir, fileName);
    try {
        fs.mkdirSync(destinationDir);
    } catch (e) {
        // todo: handle errors EXCEPT existing dir
        console.log(e);
    }
    extractor.extractVideo({
        sourceFilePath: fileName,
        destFilePath,
        startsAtSeconds,
        endsAtSeconds
    });
};

exports.extractAudio = ({destinationDir, fileName, extractPoint}) => {
    const extractor = extractors.find(extractor => extractor.supportsAudio(fileName));

    if (!extractor) {
        throw new Error(`Unable to find extractor for ${fileName}`);
    }

    const {performerInfo, startsAtSeconds, endsAtSeconds} = timeAtGetter(extractPoint);
    // todo: handle performer info
    const sourceFilePath = path.resolve(fileName);
    const destFilePath = getDestFilePath(destinationDir, fileName, '.mp3');
    try {
        fs.mkdirSync(destinationDir);
    } catch (e) {
    }
    extractor.extractAudio({
        sourceFilePath,
        destFilePath,
        startsAtSeconds,
        endsAtSeconds
    });
};

function getDestFilePath(destinationDir, sourceFilePath, fileExtension) {
    let destFilePath = cleanFileName(sourceFilePath);
    if (fileExtension) {
        destFilePath = destFilePath.replace(path.extname(destFilePath), fileExtension);
    }

    destFilePath = path.resolve(destinationDir, destFilePath);
    return indexifyIfExists(destFilePath);
}
