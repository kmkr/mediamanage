const { parseCategoriesAsArrayStr } = require('./categories-as-array-str-helper')

test('parse one category correctly', () => {
  const str = '[woz]'
  const parsed = parseCategoriesAsArrayStr(str)
  expect(parsed).toEqual(['woz'])
})

test('parse multiple categories correctly', () => {
  const str = '[woz][wiz]'
  const parsed = parseCategoriesAsArrayStr(str)
  expect(parsed).toEqual(['woz', 'wiz'])
})
