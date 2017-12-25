const config = require('../../config.json')
const logger = require('../logger')
const fileFinder = require('../../file-system/finder')
const fileRenamer = require('../../file-system/renamer')
const printPathsService = require('../../helpers/print-paths-service')

module.exports = function (vorpal) {
  vorpal
  .command('addcat [filter]', 'Multi add categories (recursive)')
  .action(({ filter }) => {
    const mediaFilePaths = fileFinder.mediaFiles({ recursive: true, filter })
    printPathsService.asList(mediaFilePaths)

    return vorpal.activeCommand.prompt({
      message: 'Enter categories',
      type: 'checkbox',
      name: 'categories',
      choices: config.categories
    }).then(({ categories }) => {
      if (categories && categories.length) {
        return vorpal.activeCommand.prompt({
          message: `Do you want to add ${categories.join(', ')}?`,
          name: 'confirmAdd',
          type: 'confirm'
        }).then(({ confirmAdd }) => {
          if (!confirmAdd) {
            return
          }

          fileRenamer.addCategories(categories, mediaFilePaths)
        })
      } else {
        logger.log('No category set')
      }
    })
  })
}
