const config = require('../config.json')
const fileRenamer = require('../file-system/renamer')
const performerNameList = require('./performer-name-list')

const MIN_LENGTH_PERFORMER_NAME = 2

module.exports = (performerNamesAndCategories, destFilePath) => {
  const categories = performerNamesAndCategories.filter(entry => config.categories.includes(entry))
  const performerNames = performerNamesAndCategories
    .filter(entry => !categories.includes(entry))
    .filter(entry => entry.length >= MIN_LENGTH_PERFORMER_NAME)

  let filePath = destFilePath

  if (performerNames.length) {
    [filePath] = fileRenamer.setPerformerNames(performerNames, [filePath])
    performerNameList.add(performerNames)
  }
  if (categories.length) {
    [filePath] = fileRenamer.setCategories(categories, [filePath])
  }

  return filePath
}
