const fileWriter = require('./file-writer')

module.exports = (filePath, content) => {
  fileWriter(filePath, JSON.stringify(content, null, 4))
}
