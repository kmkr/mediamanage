exports.parseCategoriesAsArrayStr = (str = '') => {
  return str
    .split(']')
    .map(str => str.replace('[', ''))
    .filter(e => e)
}
