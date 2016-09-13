const path = require('path');
const fs = require('fs');

const {cleanFileName} = require('../file-system/renamer-helper');
const indexifyIfExists = require('../file-system/indexify-if-exists');
const timeAtGetter = require('./time-at-getter');

const extractors = [
    require('./ffmpeg-extractor')
];

exports.extractFormat = 'Start at and ends at in format <performer1<_performer2>><_[category]>@>hh:mm:ss hh:mm:ss';

exports.extractVideo = ({dest, fileName, extractPoint}) => {
    // todo: validate extractPoint
    const extractor = extractors.find(extractor => extractor.supportsVideo(fileName));

    if (!extractor) {
        throw new Error(`Unable to find extractor for ${fileName}`);
    }

    const {performerInfo, startsAtSeconds, endsAtSeconds} = timeAtGetter(extractPoint);
    // todo: handle performer info
    const destFilePath = getDestFilePath(dest, fileName, '.mp3');
    try {
        fs.mkdirSync(dest);
    } catch (e) {
    }
    extractor.extractVideo({
        sourceFilePath: fileName,
        destFilePath,
        startsAtSeconds,
        endsAtSeconds
    });
};

exports.extractAudio = ({dest, fileName, extractPoint}) => {
    // todo: validate extractPoint
    const extractor = extractors.find(extractor => extractor.supportsAudio(fileName));

    if (!extractor) {
        throw new Error(`Unable to find extractor for ${fileName}`);
    }

    const {performerInfo, startsAtSeconds, endsAtSeconds} = timeAtGetter(extractPoint);
    // todo: handle performer info
    const sourceFilePath = path.resolve(process.cwd(), fileName);
    const destFilePath = getDestFilePath(dest, fileName, '.mp3');
    try {
        fs.mkdirSync(dest);
    } catch (e) {
    }
    extractor.extractAudio({
        sourceFilePath,
        destFilePath,
        startsAtSeconds,
        endsAtSeconds
    });
};

function getDestFilePath(dest, sourceFilePath, fileExtension) {
    let destFilePath = cleanFileName(sourceFilePath);
    if (fileExtension) {
        destFilePath = destFilePath.replace(path.extname(destFilePath), fileExtension);
    }

    destFilePath = path.resolve(dest, destFilePath);
    return indexifyIfExists(destFilePath);
}
