let logger = console.log

exports.setLogger = log => {
  logger = log
}

exports.log = (...args) => {
  logger(...args)
}
