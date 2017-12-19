const parser = require('./seconds-to-time-parser')()
const parserWithoutPadding = require('./seconds-to-time-parser')({ separator: '.', padZeros: false })
const trimParser = require('./seconds-to-time-parser')({ padZeros: false, trimStart: true })

test('parse to seconds', () => {
  expect(parser(59)).toBe('00:00:59')
})

test('parse to minute', () => {
  expect(parser(60)).toBe('00:01:00')
})

test('parse to hours', () => {
  expect(parser(3601)).toBe('01:00:01')
})

test('parse without padding', () => {
  expect(parserWithoutPadding(65)).toBe('0.1.5')
  expect(parserWithoutPadding(3601)).toBe('1.0.1')
})

test('trim parse', () => {
  expect(trimParser(60)).toBe('1:0')
  expect(trimParser(65)).toBe('1:5')
  expect(trimParser(3601)).toBe('1:0:1')
})
