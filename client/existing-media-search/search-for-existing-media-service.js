const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const levenshtein = require('fast-levenshtein')

const finder = require('../file-system/finder')
const config = require('../config.json')
const logger = require('../vorpals/logger')
const { flatten, unique } = require('../helpers/array-helper')
const existingMediaParser = require('../helpers/existing-media-parser')
const printPathsService = require('../helpers/print-paths-service')

const REPLACE_REGEXP = /[^a-z0-9]/ig
let fileCache

function allFiles () {
  const sourcePaths = config.moveMediaOptions
        .map(o => o.toDir)
        .sort()
        .filter(unique)
        .filter(filePath => fs.existsSync(filePath))

  return sourcePaths.map(sourcePath => (
        finder.mediaFiles({
          dirPath: sourcePath,
          recursive: true
        }).map(filePath => ({
          filePath,
          sourcePath
        }))
    )).reduce(flatten, [])
}

function clean (label) {
  return label
    .replace('&', 'and')
    .replace(REPLACE_REGEXP, ' ')
}

function getDistance (thisLabel, otherLabel) {
  const cleanedThisLabel = clean(thisLabel)
  const cleanedOtherLabel = clean(otherLabel)
  return levenshtein.get(thisLabel, otherLabel)
}

function isMatch (thisLabel, otherLabel) {
  return getDistance(thisLabel, otherLabel) < Math.ceil(thisLabel.length * 0.2)
}

function log (hits) {
  if (hits.length) {
    logger.log(`Found ${chalk.red(hits.length)} matching files:\n`)
  }

  printPathsService.asList(hits.map(({ filePath }) => filePath))
  logger.log('\n')
}

exports.byTitle = thisTitle => {
  if (!fileCache) {
    fileCache = allFiles()
  }

  const hits = fileCache.filter(({ filePath }) => {
    const thatTitle = existingMediaParser.getTitle(filePath)
    return isMatch(thisTitle.toLowerCase(), thatTitle)
  })

  log(hits)
}

exports.byText = (text, logHits = true) => {
  if (!fileCache) {
    fileCache = allFiles()
  }

  const hits = fileCache.filter(({ filePath }) => {
    const thatFileName = path.parse(filePath).name.toLowerCase()
    return isMatch(text, thatFileName)
  })

  if (logHits) {
    log(hits)
  }

  return hits
}

exports._isMatch = isMatch
