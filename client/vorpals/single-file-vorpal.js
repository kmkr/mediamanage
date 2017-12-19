const Vorpal = require('vorpal')
const chalk = Vorpal().chalk // eslint-disable-line new-cap
const path = require('path')
const Promise = require('bluebird')

const logger = require('./logger')

const noDownload = require('../no-download')
const currentFilePathStore = require('./single/current-file-path-store')
const mediaPlayer = require('../media-player')
const moveMedia = require('../move-media/move-media')

const fileDeleter = require('../file-system/deleter')

const autonames = require('./single/autonames')
const removeCurrentWd = require('../helpers/remove-current-wd')
const config = require('../config.json')
const searchForExistingMediaService = require('../existing-media-search/search-for-existing-media-service')

function run (onComplete) {
  const vorpal = new Vorpal()

  function setDelimiter () {
    const filePath = currentFilePathStore.get()
    const fileName = removeCurrentWd(filePath)

    vorpal.delimiter(`${chalk.green(fileName)} ${chalk.yellow('$')}`)
  }

  setDelimiter()
  vorpal.on('client_command_executed', ({ command }) => {
    if (command !== 'n' && command !== 'm') {
      setDelimiter()
    }
    logger.log('\n')
  })
  logger.setLogger(vorpal.log.bind(vorpal))

  require('./single/set-performer-names')(vorpal)
  require('./single/set-categories')(vorpal)
  require('./single/set-title')(vorpal)
  require('./single/rename-file')(vorpal)

  config.extractOptions.forEach(extractOption => {
    require('./single/extract')(vorpal, extractOption)
  })

  vorpal
        .command('m', 'Move file')
        .action(() => (
            moveMedia
                .single(vorpal, currentFilePathStore.get())
                .then(onComplete)
        ))

  vorpal.command('d', 'Delete file')
        .action(() => {
          vorpal.activeCommand.prompt({
            message: 'Delete file - are you sure?',
            type: 'confirm',
            name: 'confirmDelete'
          }, function ({ confirmDelete }) {
            if (confirmDelete) {
              return fileDeleter(currentFilePathStore.get()).then(() => {
                onComplete()
              })
            }
            onComplete()
            return Promise.resolve()
          })
        })

  vorpal
        .command('autonames', 'Set names based on file title')
        .action(() => autonames(currentFilePathStore.get()))

  vorpal
        .command('nodl', 'Add to no download')
        .action(() => noDownload(vorpal, currentFilePathStore.get()))

  vorpal.command('n', 'Go back')
        .action(() => {
          onComplete()
          return Promise.resolve()
        })

  return vorpal
}

module.exports = function (filePath, onComplete) {
  currentFilePathStore.set(filePath)
  mediaPlayer.play(currentFilePathStore.get())

  searchForExistingMediaService.byText(path.parse(filePath).name)

  return run(() => {
    mediaPlayer.stop()
    onComplete()
    currentFilePathStore.unset()
  })
}
