const chalk = require('chalk')
const path = require('path')

let add, configMock, jsonWriterMock, list, logMock, remove

beforeEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
  jest.mock('../vorpals/logger', () => ({
    log: jest.fn()
  }))
  jest.mock('../file-system/json-writer', () => jest.fn())
  jest.mock('../config.json', () => ({
    autocomplete: {
      performerNames: [
        'winnie.the.pooh',
        'piglet',
        'eeyore',
        'tigger'
      ]
    }
  }), { virtual: true })
  const performerNameList = require('./performer-name-list')
  add = performerNameList.add
  remove = performerNameList.remove
  list = performerNameList.list

  configMock = require('../config.json')
  jsonWriterMock = require('../file-system/json-writer')
  logMock = require('../vorpals/logger')
})

test('list', () => {
  const performerNames = list()
  expect(performerNames[1]).toEqual('piglet')
  expect(performerNames).toEqual(configMock.autocomplete.performerNames)
})

test('adds to list', () => {
  add(['owl'])
  const performerNames = list()
  expect(performerNames[performerNames.length - 1]).toEqual('owl')
})

test('add updates config', () => {
  const origPerformerNames = list()
  add(['owl'])
  expect(jsonWriterMock).toHaveBeenCalledWith(path.resolve(__dirname, '../config.json'), {
    autocomplete: { performerNames: origPerformerNames.concat('owl') }
  })
})

test('add updates list', () => {
  const origPerformerNames = list()
  add(['owl'])
  expect(list()).toEqual([
    ...origPerformerNames,
    'owl'
  ])
})

test('add logs', () => {
  add(['owl'])
  expect(logMock.log).toHaveBeenCalledWith(`Updated autocomplete set. Added ${chalk.bold('owl')}, no removals.`)
})

test('removes from list', () => {
  remove(['eeyore', 'piglet'])
  const performerNames = list()
  expect(performerNames).toEqual([
    'winnie.the.pooh',
    'tigger'
  ])
})

test('remove updates config', () => {
  remove(['winnie.the.pooh', 'piglet', 'eeyore'])
  expect(jsonWriterMock).toHaveBeenCalledWith(path.resolve(__dirname, '../config.json'), {
    autocomplete: { performerNames: ['tigger'] }
  })
})

test('remove updates list', () => {
  remove(['winnie.the.pooh', 'piglet', 'eeyore'])
  expect(list()).toEqual([
    'tigger'
  ])
})

test('remove logs', () => {
  remove(['piglet', 'eeyore'])
  expect(logMock.log).toHaveBeenCalledWith(`Updated autocomplete set. No additions, removed ${chalk.bold('piglet')}, ${chalk.bold('eeyore')}.`)
})
