const chalk = require("chalk");
const Promise = require("bluebird");
const exec = require("child_process").exec;
const logger = require("../vorpals/logger");
const removeCurrentWd = require("../helpers/remove-current-wd");

const secondsToTimeParser = require("./seconds-to-time-parser")();

const SUPPORT_VIDEO_EXTRACT_REGEXP = /\.(mp4|avi|mpeg|iso|wmv|mov|m4v)$/i;
const SUPPORT_AUDIO_EXTRACT_REGEXP = /\.(mp4|avi|mpeg|iso|wmv|mp3|m4v)$/i;

exports.supportsVideo = fileName =>
  fileName.match(SUPPORT_VIDEO_EXTRACT_REGEXP);
exports.supportsAudio = fileName =>
  fileName.match(SUPPORT_AUDIO_EXTRACT_REGEXP);

exports.extractVideo = async ({
  sourceFilePath,
  destFilePath,
  startsAtSeconds,
  endsAtSeconds
}) => {
  const lengthInSeconds = endsAtSeconds - startsAtSeconds;
  logger.log(
    `\nExtracting to ${chalk.yellow(removeCurrentWd(destFilePath))} ...`
  );
  const output = await run(
    `ffmpeg -ss ${secondsToTimeParser(
      startsAtSeconds
    )} -i "${sourceFilePath}" -t ${secondsToTimeParser(
      lengthInSeconds
    )} -vcodec copy -acodec copy "${destFilePath}" -loglevel warning`
  );
  output.forEach(line => {
    logger.log(line);
  });
};

exports.extractAudio = async ({
  sourceFilePath,
  destFilePath,
  startsAtSeconds,
  endsAtSeconds
}) => {
  const lengthInSeconds = endsAtSeconds - startsAtSeconds;

  logger.log(
    `\nExtracting to ${chalk.yellow(removeCurrentWd(destFilePath))} ...`
  );
  const output = await run(
    `ffmpeg -ss ${secondsToTimeParser(
      startsAtSeconds
    )} -t ${secondsToTimeParser(
      lengthInSeconds
    )} -i "${sourceFilePath}" -acodec libmp3lame -ab 196k "${destFilePath}" -loglevel warning`
  );
  output.forEach(line => {
    logger.log(line);
  });
};

exports.getLength = async filePath => {
  const output = await run(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
  );
  if (output.length) {
    return Number(output[0]);
  }
};

function run(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      const output = [stdout, stderr]
        .filter(e => e)
        .join(/\n/)
        .split(/\n/)
        .filter(l => l);

      return resolve(output);
    });
  });
}
