const ffmpegMovieExtractor = require('./extractors/ffmpeg');

const EXTRACTORS = [
    {
        type: 'video',
        fileMatch: /\.(mp4|avi|mpeg|iso|wmv)$/i,
        prompt: ffmpegMovieExtractor
    }/*,
    {
        type: 'audio',
        fileMatch: /\.(mp4|avi|mpeg|iso|wmv)$/i,
        extractor: ffmpegAudioExtractor
    }*/
];

module.exports = function (type, destDirectory) {
    return fileName => {
        const extractor = EXTRACTORS.find(e => fileName.match(e.fileMatch));

        if (!extractor) {
            console.log(`Unable to find extractor for file ${fileName}`);
            return;
        }

        return extractor.prompt(fileName, destDirectory);
    };
};
