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

function getUnderscoreIndices (fileName) {
  return fileName.split('').reduce((ary, char, index) => {
    if (char === '_') {
      ary.push(index)
    }

    return ary
  }, [])
}

function getCategories (_fileName) {
  assert(_fileName, `File name must be present. Was: ${_fileName}`)

  const fileName = path.parse(_fileName).name
  const underscoreIndexes = getUnderscoreIndices(fileName)
  const lastUnderscoreIndex = underscoreIndexes[underscoreIndexes.length - 1]

  const categoryPart = fileName
    .substring(lastUnderscoreIndex + 1)

  if (!categoryPart.match(/\[/)) {
    return []
  }

  return categoryPart
    .split(']')
    .map(str => str.replace('[', ''))
    .filter(e => e)
}

exports.getCategories = getCategories

exports.isProcessed = fileName => {
  assert(fileName, `File name must be present. Was: ${fileName}`)
  const underscoreIndexes = getUnderscoreIndices(fileName)

  if (underscoreIndexes.length < 2) {
    return false
  }

  return !!getCategories(fileName).length
}
