const path = require('path')
const { categoriesAsStr } = require('./on-processing-renamer-helper')
const { getCategories } = require('../existing-media-parser')

exports.cleanFilePath = uncleanedFilePath => {
  throw new Error('NYI')
}

exports.setTitle = (title, filePath) => {
  throw new Error('NYI')
}

exports.setPerformerNames = (performers, filePath) => {
  throw new Error('NYI')
}

exports.setCategories = (categories, filePath) => {
  const fileName = path.parse(filePath).base
  return filePath.replace(categoriesAsStr(getCategories(fileName)), categoriesAsStr(categories))
}

exports.indexify = filePath => {
  throw new Error('NYI')
}

exports.getCategories = getCategories
