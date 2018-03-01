const fs = require('fs')
const klawSync = require('klaw-sync')
const path = require('path')
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
const matchesGlob = require('../file-system/matches-glob')

function isAudio (filePath) {
  return filePath.match(/\.(mp3|wav|wma|flac|ogg)$/i)
}

function isVideo (filePath) {
  return filePath.match(/\.(mkv|mp4|avi|mpeg|iso|wmv|m2ts|mov|m4v)$/i)
}

function allFiles ({ dirPath = process.cwd(), filter, recursive = false, includeDir = false } = {}) {
  if (!path.isAbsolute(dirPath)) {
    dirPath = path.resolve(dirPath)
  }

  let files

  if (recursive) {
    files = klawSync(dirPath, { nodir: !includeDir }).map(({ path }) => path)
  } else {
    files = fs.readdirSync(dirPath)
            .map(fileName => path.resolve(process.cwd(), dirPath, fileName))
            .filter(filePath => includeDir || fs.statSync(filePath).isFile())
  }

  if (filter) {
    files = files.filter(file => matchesGlob(file.replace(`${dirPath}${path.sep}`, ''), filter))
  }

  return files.sort(collator.compare)
}

exports.allFiles = allFiles

exports.mediaFiles = ({ dirPath = process.cwd(), filter, recursive = false } = {}) => {
  return allFiles({ dirPath, filter, recursive }).filter(filePath => (
        isAudio(filePath) || isVideo(filePath)
    ))
}

exports.video = ({ dirPath = process.cwd(), filter, recursive = false } = {}) => {
  return allFiles({ dirPath, filter, recursive }).filter(isVideo)
}

exports.audio = ({ dirPath = process.cwd(), filter, recursive = false } = {}) => {
  return allFiles({ dirPath, filter, recursive }).filter(isAudio)
}
