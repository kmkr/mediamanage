const path = require('path')
const Promise = require('bluebird')

const movedFilesService = require('../file-system/moved-files-service')
const removeCurrentWd = require('../helpers/remove-current-wd')
const { moveAll } = require('./mover')
const promptCreateFolder = require('./prompt-create-folder')
const logger = require('../vorpals/logger')
const { unique } = require('../helpers/array-helper')

const TIME_THRESHOLD_MS = 5000

module.exports = (vorpalInstance) => {
  const movedFiles = movedFilesService.get()

  if (!movedFiles.length) {
    logger.log('No files are moved in this session')
    return Promise.resolve()
  }

  const latestMoveTimestamp = movedFiles[movedFiles.length - 1].timestamp

  const choices = movedFiles.map(({ sourceFilePath, destFilePath, timestamp }, index) => {
    const checked = timestamp >= latestMoveTimestamp - TIME_THRESHOLD_MS
    return {
      name: `${removeCurrentWd(sourceFilePath)} → ${removeCurrentWd(destFilePath)}`,
      value: index,
      checked
    }
  })

  return vorpalInstance.activeCommand.prompt({
    message: 'Which moves do you want to undo?',
    name: 'indexes',
    type: 'checkbox',
    choices
  }).then(({ indexes }) => {
    if (!indexes.length) {
      return
    }

    const filePaths = indexes
            .map(index => movedFiles[index].destFilePath)
            .reverse()
    const destDirPaths = indexes
            .map(index => movedFiles[index].sourceFilePath)
            .reverse()
    const uniqueDirs = destDirPaths
            .map(destDirPath => path.parse(destDirPath).dir)
            .sort()
            .filter(unique)
    return Promise.reduce(uniqueDirs, (t, dir) => (
            promptCreateFolder(dir, vorpalInstance)
        ), null).then(() => {
          return moveAll({
            filePaths,
            destDirPaths,
            vorpalInstance
          })
        })
  })
}
