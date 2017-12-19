const chalk = require('chalk')
const config = require('../../config.json')
const currentFilePathStore = require('./current-file-path-store')
const { extractAudio, extractVideo, validate, mapToSeconds } = require('../../media-extract')
const secondsToTimeParser = require('../../media-extract/seconds-to-time-parser')({ separator: '.', padZeros: false, trimStart: true })
const logger = require('../logger')
const performerNameList = require('../../performers/performer-name-list')
const categoriesAndPerformerNamesHandler = require('../../performers/categories-and-performer-names-handler')
const mover = require('../../file-system/mover')
const removeCurrentWd = require('../../helpers/remove-current-wd')

let autoFillInput = ''

module.exports = (vorpal, extractOption) => {
  const { commandKey, destination, replaceFile, type } = extractOption
  const commandPrompt = `${commandKey} <from> <to> [performerNamesAndCategories...]`

  vorpal
        .command(commandPrompt, `Extract to ${destination}`)
        .types({
          string: ['_']
        })
        .validate(({ from, to, performerNamesAndCategories = [] }) => {
          const isValid = validate({ from, to, performerNamesAndCategories })
          if (!isValid) {
            logger.log('Invalid input')
          }

          const { startsAtSeconds, endsAtSeconds } = mapToSeconds(from, to)
          const previousRangeSpan = endsAtSeconds - startsAtSeconds
          const time = secondsToTimeParser(endsAtSeconds + previousRangeSpan)

          autoFillInput = [to, time].concat(performerNamesAndCategories).join(' ')
          return isValid
        })
        .autocomplete({
          data: () => config.categories
                .concat(performerNameList.list())
        })
        .action(({ from, to, performerNamesAndCategories = [] }) => {
          const fn = type === 'video' ? extractVideo : extractAudio
          performerNamesAndCategories = performerNamesAndCategories.map(entry => entry.trim())
          const filePath = currentFilePathStore.get()

          return fn({
            destinationDir: destination,
            filePath,
            from,
            to
          }).then(({ destFilePath, secondsRemaining }) => {
            logger.log('Extraction complete')

            if (replaceFile) {
              if (performerNamesAndCategories.length) {
                logger.log(`${chalk.red('WARN: ')} replace file cannot be combined with changing performer names nor categories`)
              }
              return vorpal.activeCommand.prompt({
                message: `Do you want to replace ${chalk.yellow(removeCurrentWd(filePath))} with ${removeCurrentWd(destFilePath)}?`,
                name: 'confirmReplace',
                type: 'confirm'
              }).then(({ confirmReplace }) => {
                if (!confirmReplace) {
                  return
                }

                mover(destFilePath, filePath)
              })
            }

            categoriesAndPerformerNamesHandler(performerNamesAndCategories, destFilePath)

            if (secondsRemaining > 60) {
              setTimeout(() => {
                vorpal.ui.input(`${commandKey} ${autoFillInput} `)
              }, 10)
            }
          })
        })
}
