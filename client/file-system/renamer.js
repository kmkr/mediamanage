const assert = require('assert')
const path = require('path')
const config = require('../config.json')
const logger = require('../vorpals/logger')

const indexifyIfExists = require('./indexify-if-exists')
const onProcessingRenamerHelper = require('../helpers/on-processing-renamer-helper')
const nonProcessingRenamerHelper = require('../helpers/non-processing-renamer-helper')
const mover = require('./mover')
const { unique } = require('../helpers/array-helper')

function getRenamerHelper (filePath) {
  const isProcessed = nonProcessingRenamerHelper.isProcessed(path.parse(filePath).base)

  return isProcessed ? nonProcessingRenamerHelper : onProcessingRenamerHelper
}

function move (sourceFilePath, destFileName) {
  if (sourceFilePath === destFileName) {
    logger.log('Source and destination is the same - noop')
    return sourceFilePath
  }
  const destFilePath = indexifyIfExists(
    path.resolve(destFileName)
  )
  return mover(sourceFilePath, destFilePath)
}

exports.rename = (newFileName, filePath) => {
  assert(path.isAbsolute(filePath), `File path must be absolute. Was: ${filePath}`)
  assert(newFileName, `File name must be set. Was: ${newFileName}`)

  const sourceFilePath = filePath
  const currentFileName = path.parse(sourceFilePath).name
  const destFilePath = sourceFilePath.replace(currentFileName, newFileName)

  return move(sourceFilePath, destFilePath)
}

exports.setTitle = (title, filePaths) => {
  return filePaths.map(filePath => {
    const newFileName = getRenamerHelper(filePath).setTitle(title, filePath)
    return move(filePath, newFileName)
  })
}

exports.setPerformerNames = (performerNames, filePaths) => {
  assert(Array.isArray(performerNames), `Names must be an array. Was ${performerNames}`)
  assert(Array.isArray(filePaths), `File paths must be an array. Was ${filePaths}`)

  return filePaths.map(filePath => {
    const newFileName = getRenamerHelper(filePath).setPerformerNames(performerNames, filePath)
    return move(filePath, newFileName)
  })
}

function setCategories (categories, filePath) {
  const sortedCategories = config.categories.filter(category => categories.includes(category))
  const newFileName = getRenamerHelper(filePath).setCategories(sortedCategories, filePath)
  return move(filePath, newFileName)
}

exports.setCategories = (categories, filePaths) => {
  assert(Array.isArray(categories), `Categories must be an array. Was ${categories}`)
  assert(Array.isArray(filePaths), `File paths must be an array. Was ${filePaths}`)

  return filePaths.map(filePath => setCategories(categories, filePath))
}

exports.addCategories = (categories, filePaths) => {
  assert(Array.isArray(categories), `Categories must be an array. Was ${categories}`)
  assert(Array.isArray(filePaths), `File paths must be an array. Was ${filePaths}`)

  return filePaths.map(filePath => {
    const existingCategories = getRenamerHelper(filePath).getCategories(path.parse(filePath).base)

    setCategories([
      ...existingCategories,
      ...categories
    ].filter(unique), filePath)
  })
}
