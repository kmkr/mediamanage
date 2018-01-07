const assert = require('assert')
const path = require('path')
const { parseCategoriesAsArrayStr } = require('./categories-as-array-str-helper')

/* eslint-disable no-multi-spaces */
const STORED_FILE_REGEXP = new RegExp(
    '([^_]{5,})' +          // title of at least five chars
    '_' +                   // required title - performer names separator
    '([a-z\'._]{4,})' +     // at least one performer name, four chars minimum
    '((\\[\\w+\\])*)' +       // zero or more categories
    '(_\\(\\d+\\)){0,1}' +  // zero or one index
    '\\.\\w{2,4}$'          // required file extension
)
/* eslint-enable no-multi-spaces */

function filenameWithExt (filePath) {
  const parsed = path.parse(filePath)
  return `${parsed.name}${parsed.ext}`
}

function match (filePath) {
  const [, title, performerNamesStr, categoriesStr] = filenameWithExt(filePath).match(STORED_FILE_REGEXP) || []

  return {
    title,
    categories: parseCategoriesAsArrayStr(categoriesStr),
    performerNames: (performerNamesStr || '')
            .split('_')
            .filter(name => name)
  }
}

function getPerformerNames (filePath) {
  assert(filePath, 'filePath cannot be empty')

  return match(filePath).performerNames
}

exports.getPerformerNames = getPerformerNames

exports.getTitle = filePath => {
  assert(filePath, 'filePath cannot be empty')

  return match(filePath).title || path.parse(filePath).name
}

exports.renamePerformerName = ({ filePath, fromName, toName }) => {
  assert(filePath, 'filePath cannot be empty')
  assert(fromName, 'fromName cannot be empty')
  assert(toName, 'fromName cannot be empty')

  const newFileName = filenameWithExt(filePath).replace(STORED_FILE_REGEXP, match => {
    const performerNames = getPerformerNames(filePath)
    const newPerformerNames = performerNames.map(name => name === fromName ? toName : name)

    return match.replace(`_${performerNames.join('_')}`, `_${newPerformerNames.join('_')}`)
  })

  const { dir } = path.parse(filePath)

  return dir ? `${dir}${path.sep}${newFileName}` : newFileName
}

exports.getCategories = filePath => {
  assert(filePath, 'filePath cannot be empty')

  return match(filePath).categories
}
