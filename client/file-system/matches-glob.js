const minimatch = require('minimatch')

module.exports = (arg, filter = '*') => minimatch(arg, filter, { nocase: true })
