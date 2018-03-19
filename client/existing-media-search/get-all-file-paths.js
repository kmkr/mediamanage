const fs = require('fs')

const finder = require('../file-system/finder')
const { flatten, unique } = require('../helpers/array-helper')
const config = require('../config.json')

let fileCache

module.exports = () => {
  if (fileCache) {
    return fileCache
  }
  const sourcePaths = config.moveMediaOptions
        .map(o => o.toDir)
        .sort()
        .filter(unique)
        .filter(filePath => fs.existsSync(filePath))

  const allFilePaths = sourcePaths.map(sourcePath => (
        finder.mediaFiles({
          dirPath: sourcePath,
          recursive: true
        })
    )).reduce(flatten, [])

  fileCache = allFilePaths
  return allFilePaths
}
