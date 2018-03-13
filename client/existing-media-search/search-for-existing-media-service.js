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
    .toLowerCase()
    .replace('&', 'and')
    .replace(REPLACE_REGEXP, ' ')
}

function getDistance (thisLabel, otherLabel) {
  const cleanedThisLabel = clean(thisLabel)
  const cleanedOtherLabel = clean(otherLabel)
  if (cleanedThisLabel.includes(cleanedOtherLabel) ||
    cleanedOtherLabel.includes(cleanedThisLabel)) {
    return 0
  }
  return levenshtein.get(cleanedThisLabel, cleanedOtherLabel)
}

function isMatch (thisLabel, distance) {
  return distance < Math.max(
    Math.ceil(thisLabel.length * 0.2),
    6
  )
}

function log (hits) {
  if (hits.length) {
    logger.log(`Found ${chalk.red(hits.length)} matching files:\n`)
  }

  printPathsService.asList(hits.map(({ filePath }) => filePath))
  logger.log('\n')
}

function search (fun, logHits = true) {
  if (!fileCache) {
    fileCache = allFiles()
  }

  const bestMatch = {
    distance: Infinity,
    value: null
  }

  const hits = fileCache.reduce((prevVal, curVal) => {
    const { thisLabel, thatLabel } = fun(curVal)
    const distance = getDistance(thisLabel, thatLabel)

    const match = isMatch(thisLabel, distance)
    if (match) {
      prevVal.push(curVal)
    }
    if (distance < bestMatch.distance) {
      bestMatch.distance = distance
      bestMatch.value = thatLabel
    }
    return prevVal
  }, [])

  if (logHits) {
    logger.log(`Best match - distance ${bestMatch.distance} chars\n${bestMatch.value}`)
    log(hits)
  }

  return hits
}

exports.byTitle = thisTitle => {
  search(function ({ filePath }) {
    return {
      thisLabel: thisTitle,
      thatLabel: existingMediaParser.getTitle(filePath)
    }
  })
}

exports.byText = (text, logHits = true) => {
  return search(function ({ filePath }) {
    return {
      thisLabel: text,
      thatLabel: path.parse(filePath).name
    }
  }, logHits)
}

exports._isMatch = isMatch
