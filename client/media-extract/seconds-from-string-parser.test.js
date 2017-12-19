const parser = require('./seconds-from-string-parser')

test('parse seconds', () => {
  expect(parser('60') === 60).toBe(true)
})

test('parse minutes', () => {
  expect(parser('1.20') === 80).toBe(true)
})

test('parse hours', () => {
  expect(parser('1.1.1') === 3661).toBe(true)
})
