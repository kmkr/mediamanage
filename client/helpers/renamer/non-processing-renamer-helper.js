const path = require('path')
const { categoriesAsStr } = require('./on-processing-renamer-helper')
const { getCategories, getPerformerNames, getTitle } = require('../existing-media-parser')

exports.cleanFilePath = uncleanedFilePath => {
  throw new Error('NYI')
}

exports.setTitle = (title, filePath) => {
  const existingTitle = getTitle(filePath)
  return filePath.replace(existingTitle, title)
}

exports.setPerformerNames = (performers, filePath) => {
  const performerNames = getPerformerNames(filePath)
  return filePath.replace(performerNames.join('_'), performers.join('_'))
}

exports.setCategories = (categories, filePath) => {
  const fileName = path.parse(filePath).base
  return filePath.replace(categoriesAsStr(getCategories(fileName)), categoriesAsStr(categories))
}

exports.indexify = filePath => {
  throw new Error('NYI')
}

exports.getCategories = getCategories
