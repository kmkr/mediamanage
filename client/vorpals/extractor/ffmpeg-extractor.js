const path = require('path');
const secondsToTimeParser = require('./seconds-to-time-parser')();

const SUPPORT_VIDEO_EXTRACT_REGEXP = /\.(mp4|avi|mpeg|iso|wmv)$/i;
const SUPPORT_AUDIO_EXTRACT_REGEXP = /\.(mp4|avi|mpeg|iso|wmv)$/i;

exports.supportsVideo = fileName => fileName.match(SUPPORT_VIDEO_EXTRACT_REGEXP);
exports.supportsAudio = fileName => fileName.match(SUPPORT_AUDIO_EXTRACT_REGEXP);

exports.extractVideo = ({dest, fileName, startsAtSeconds, endsAtSeconds}) => {
    // todo: call ffmpeg
    // https://github.com/kmkr/moviemanage/blob/master/app/splitter/ffmpeg_processor.rb
    // https://github.com/kmkr/moviemanage/blob/master/app/splitter/post_split_processor.rb
    console.log(`todo call ffmpeg with ${dest} ${fileName} ${startsAtSeconds} ${endsAtSeconds}`);
};

exports.extractAudio = ({dest, fileName, startsAtSeconds, endsAtSeconds}) => {
    const lengthInSeconds = endsAtSeconds - startsAtSeconds;
    const audioName = fileName.replace(path.extname(fileName), '.mp3');
    const command = `ffmpeg -ss ${secondsToTimeParser(startsAtSeconds)} -t ${secondsToTimeParser(lengthInSeconds)} -i \"${fileName}\" -acodec libmp3lame -ab 196k \"${path.resolve(dest, audioName)}\" -loglevel warning`;
    console.log(`todo call ffmpeg with ${command}`);
};
