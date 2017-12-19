const config = require('../../config.json')
const currentFilePathStore = require('./current-file-path-store')
const fileRenamer = require('../../file-system/renamer')
const logger = require('../logger')

module.exports = function (vorpal) {
  vorpal
        .command('cat', 'Set categories')
        .action(() => {
          return vorpal.activeCommand.prompt({
            message: 'Enter categories',
            type: 'checkbox',
            name: 'categories',
            choices: config.categories
          }).then(({ categories }) => {
            if (categories && categories.length) {
              const [newPath] = fileRenamer.setCategories(categories, [currentFilePathStore.get()])
              currentFilePathStore.set(newPath)
            } else {
              logger.log('No category set')
            }
          })
        })
}
