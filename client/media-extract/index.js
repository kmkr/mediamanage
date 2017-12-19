const path = require('path')
const fs = require('fs')

const indexifyIfExists = require('../file-system/indexify-if-exists')
const secondsFromStringParser = require('./seconds-from-string-parser')

const extractors = [
  require('./ffmpeg-extractor')
]

function mkdir (dirName) {
  try {
    fs.mkdirSync(dirName)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
}

function map (from, to) {
  const startsAtSeconds = secondsFromStringParser(`${from}`)
  const endsAtSeconds = secondsFromStringParser(`${to}`)

  return {
    startsAtSeconds,
    endsAtSeconds
  }
}

exports.mapToSeconds = map

function validate ({ from, to, performerNames }) {
  const { startsAtSeconds, endsAtSeconds } = map(from, to)

  if (performerNames && !Array.isArray(performerNames)) {
    return false
  }

  if (startsAtSeconds >= endsAtSeconds) {
    return false
  }

  if (from < 0 || to < 0) {
    return false
  }

  return true
}

exports.validate = validate

exports.extractVideo = ({ destinationDir, filePath, from, to }) => {
  const extractor = extractors.find(extractor => extractor.supportsVideo(filePath))

  if (!extractor) {
    throw new Error(`Unable to find extractor for ${filePath}`)
  }
  if (!validate({ from, to })) {
    throw new Error(`Something is wrong with from ${from} or to ${to}`)
  }

  const { startsAtSeconds, endsAtSeconds } = map(from, to)
  const destFilePath = getDestFilePath(destinationDir, filePath)
  mkdir(path.parse(destFilePath).dir)
  return Promise.all([
    extractor.extractVideo({
      sourceFilePath: filePath,
      destFilePath,
      startsAtSeconds,
      endsAtSeconds
    }),
    getLength(filePath)
  ]).then(([, totalSeconds]) => ({
    destFilePath,
    secondsRemaining: totalSeconds - endsAtSeconds,
    totalSeconds
  }))
}

exports.extractAudio = ({ destinationDir, filePath, from, to }) => {
  const extractor = extractors.find(extractor => extractor.supportsAudio(filePath))

  if (!extractor) {
    throw new Error(`Unable to find extractor for ${filePath}`)
  }
  if (!validate({ from, to })) {
    throw new Error(`Something is wrong with from ${from} to ${to}`)
  }

  const { startsAtSeconds, endsAtSeconds } = map(from, to)
  const destFilePath = getDestFilePath(destinationDir, filePath, '.mp3')
  mkdir(path.parse(destFilePath).dir)
  return Promise.all([
    extractor.extractAudio({
      sourceFilePath: filePath,
      destFilePath,
      startsAtSeconds,
      endsAtSeconds
    }),
    getLength(filePath)
  ]).then(([, totalSeconds]) => ({
    destFilePath,
    secondsRemaining: totalSeconds - endsAtSeconds,
    totalSeconds
  }))
}

function getLength (filePath) {
  const extractor = extractors.find(extractor => extractor.supportsAudio(filePath) || extractor.supportsVideo(filePath))

  if (!extractor) {
    throw new Error(`Unable to find extractor for ${filePath}`)
  }

  return extractor.getLength(filePath)
}

function getDestFilePath (destinationDir, sourceFilePath, fileExtension) {
  const parsed = path.parse(sourceFilePath)
  const sourceFileDir = parsed.dir
  let fileName = parsed.base
  if (fileExtension) {
    fileName = fileName.replace(path.extname(fileName), fileExtension)
  }

  const destFilePath = path.resolve(sourceFileDir, destinationDir, fileName)
  return indexifyIfExists(destFilePath)
}
