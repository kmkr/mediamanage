const secondsFromStringParser = require('./seconds-from-string-parser');
const performerNameCleaner = require('../performers/name-cleaner');

module.exports = extractPoint => {
    let performerInfo, times;
    if (extractPoint.match('@')) {
        [performerInfo, times] = extractPoint.split('@');
    } else {
        times = extractPoint;
    }

    const [startsAt, endsAt] = times.split(/\s/);
    const startsAtSeconds = secondsFromStringParser(startsAt);
    const endsAtSeconds = secondsFromStringParser(endsAt);

    return {
        performerInfo: performerNameCleaner(performerInfo),
        startsAtSeconds,
        endsAtSeconds
    };
};
