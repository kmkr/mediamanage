const Promise = require('bluebird')
const path = require('path')

const config = require('../config')
const fileWriter = require('../file-system/file-writer')
const { cleanFilePath } = require('../helpers/renamer/on-processing-renamer-helper')

module.exports = (vorpalInstance, label) => (
    new Promise((resolve, reject) => {
      const noDownloadPath = config.nodownload.path
      const reasons = config.nodownload.reasons

      if (!noDownloadPath || !reasons || !reasons.length) {
        return reject(new Error('Missing nodownload config - continuing'))
      }

      if (!path.isAbsolute(noDownloadPath)) {
        return reject(new Error(`nodownloadpath must be absolute. Was ${noDownloadPath}`))
      }

      vorpalInstance.activeCommand.prompt({
        message: 'Enter reason',
        type: 'list',
        name: 'reason',
        choices: reasons
      }, function ({ reason }) {
        if (reason) {
          const extName = path.parse(label).ext
          const cleanedFileName = cleanFilePath(path.parse(label).base)

          const nodlTitle = extName ? cleanedFileName.replace(extName, `_${reason}`) : `${cleanedFileName}_${reason}`

          const filePathToTouch = path.join(noDownloadPath, nodlTitle)
          fileWriter(filePathToTouch)
        }
        resolve()
      })
    })
)
