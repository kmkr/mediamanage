const Vorpal = require('vorpal')
const chalk = Vorpal().chalk // eslint-disable-line new-cap
const searchForExistingMediaService = require('../../existing-media-search/search-for-existing-media-service')

const MAX_HITS = 20

module.exports = function (vorpal) {
  vorpal
        .command('f <searchText>', 'Find existing files by searching file system')
        .action(() => {
          vorpal.ui.redraw.clear()
          return Promise.resolve()
        })

  vorpal.on('keypress', ({ value }) => {
    if (!value) {
      return
    }
    const match = value.match(/f (.*)/)
    if (!match) {
      return
    }
    const searchText = match[1]
    if (!searchText) {
      return
    }
    const hits = searchForExistingMediaService.byText(searchText, false)

    if (!hits.length) {
      vorpal.ui.redraw('No results')
      return
    }
    const truncatedText = hits.length > MAX_HITS
            ? `Too many results. ${hits.length - MAX_HITS} results are not shown.\n\n` : ''
    const hitsStr = hits
            .slice(0, MAX_HITS)
            .reduce((prevVal, curVal) => {
              const { sourcePath, filePath } = curVal
              return `${prevVal}${sourcePath}${chalk.green(filePath.replace(sourcePath, ''))}\n`
            }, '')
    vorpal.ui.redraw(`${hitsStr}\n\n${truncatedText}f ${searchText}`)
  })
}
