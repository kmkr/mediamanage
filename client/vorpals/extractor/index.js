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
    extractor.extractVideo({dest, fileName, startsAtSeconds, endsAtSeconds});
};

exports.extractAudio = ({dest, fileName, extractPoint}) => {
    // todo: validate extractPoint
    const extractor = extractors.find(extractor => extractor.supportsVideo(fileName));

    if (!extractor) {
        throw new Error(`Unable to find extractor for ${fileName}`);
    }

    const {performerInfo, startsAtSeconds, endsAtSeconds} = timeAtGetter(extractPoint);
    // todo: handle performer info
    extractor.extractAudio({dest, fileName, startsAtSeconds, endsAtSeconds});
};
