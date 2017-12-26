const assert = require('assert')
const path = require('path')
const { categoriesAsStr } = require('./on-processing-renamer-helper')

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

function getCategories (_fileName) {
  assert(_fileName, `File name must be present. Was: ${_fileName}`)

  const fileName = path.parse(_fileName).name

  const categoryPart = fileName.match(/_\[[^_]+/)

  if (!categoryPart) {
    return []
  }

  return categoryPart[0]
    .substring(1)
    .split(']')
    .map(str => str.replace('[', ''))
    .filter(e => e)
}

exports.getCategories = getCategories

exports.isProcessed = fileName => {
  assert(fileName, `File name must be present. Was: ${fileName}`)
  const underscores = fileName.match(/_/g)

  if (!underscores || underscores.length < 2) {
    return false
  }

  return !!getCategories(fileName).length
}
