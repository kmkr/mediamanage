const chalk = require('chalk')
const fs = require('fs')
const mkdirp = require('mkdirp')
const logger = require('../vorpals/logger')

module.exports = (path, vorpalInstance) => (
    fs.readdirAsync(path).catch(err => {
      if (err.code === 'ENOENT') {
        return vorpalInstance.activeCommand.prompt({
          message: `${chalk.yellow(path)} does not exist, do you want to create it?`,
          name: 'create',
          type: 'confirm'
        }).then(({ create }) => {
          if (create) {
            return mkdirp.mkdirpAsync(path)
                        .then(() => [])
          } else {
            logger.log(`Won't create ${path} - continuing`)
            return []
          }
        })
      } else {
        throw err
      }
    })
)
