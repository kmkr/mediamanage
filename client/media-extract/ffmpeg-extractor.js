const exec = require('child_process').exec;

const secondsToTimeParser = require('./seconds-to-time-parser')();

const SUPPORT_VIDEO_EXTRACT_REGEXP = /\.(mp4|avi|mpeg|iso|wmv)$/i;
const SUPPORT_AUDIO_EXTRACT_REGEXP = SUPPORT_VIDEO_EXTRACT_REGEXP;

exports.supportsVideo = fileName => fileName.match(SUPPORT_VIDEO_EXTRACT_REGEXP);
exports.supportsAudio = fileName => fileName.match(SUPPORT_AUDIO_EXTRACT_REGEXP);

exports.extractVideo = ({sourceFilePath, destFilePath, startsAtSeconds, endsAtSeconds}) => {
    // todo: handle performer info
    // https://github.com/kmkr/moviemanage/blob/master/app/splitter/post_split_processor.rb
    const lengthInSeconds = endsAtSeconds - startsAtSeconds;
    run(`ffmpeg -ss ${startsAtSeconds} -i "${sourceFilePath}" -t ${lengthInSeconds} -vcodec copy -acodec copy "${destFilePath}" -loglevel warning`);
};

exports.extractAudio = ({sourceFilePath, destFilePath, startsAtSeconds, endsAtSeconds}) => {
    const lengthInSeconds = endsAtSeconds - startsAtSeconds;

    run(`ffmpeg -ss ${secondsToTimeParser(startsAtSeconds)} -t ${secondsToTimeParser(lengthInSeconds)} -i "${sourceFilePath}" -acodec libmp3lame -ab 196k "${destFilePath}" -loglevel warning`);
};

function run(command) {
    console.log(`Running ${command}`);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}
