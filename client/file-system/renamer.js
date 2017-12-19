const assert = require('assert')
const path = require('path')
const config = require('../config.json')

const indexifyIfExists = require('./indexify-if-exists')
const renamerHelper = require('../helpers/renamer-helper')
const mover = require('./mover')

function move (sourceFilePath, destFileName) {
  const destFilePath = indexifyIfExists(
    path.resolve(destFileName)
  )
  mover(sourceFilePath, destFilePath)
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
    const newFileName = renamerHelper.setTitle(title, filePath)
    return move(filePath, newFileName)
  })
}

exports.setPerformerNames = (performerNames, filePaths) => {
  assert(Array.isArray(performerNames), `Names must be an array. Was ${performerNames}`)
  assert(Array.isArray(filePaths), `File paths must be an array. Was ${filePaths}`)

  return filePaths.map(filePath => {
    const newFileName = renamerHelper.setPerformerNames(performerNames, filePath)
    return move(filePath, newFileName)
  })
}

exports.setCategories = (categories, filePaths) => {
  assert(Array.isArray(categories), `Categories must be an array. Was ${categories}`)
  assert(Array.isArray(filePaths), `File paths must be an array. Was ${filePaths}`)

  return filePaths.map(filePath => {
    const sortedCategories = config.categories.filter(category => categories.includes(category))
    const newFileName = renamerHelper.setCategories(sortedCategories, filePath)
    return move(filePath, newFileName)
  })
}
