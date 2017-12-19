const autonames = require('../../performers/autonames')
const fileFinder = require('../../file-system/finder')

module.exports = function (vorpal) {
  vorpal
        .command('autonames', 'Set names based on file title')
        .action(() => {
          fileFinder.mediaFiles({ recursive: true }).forEach(filePath => {
            autonames(filePath)
          })
        })
}
