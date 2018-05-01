const { getTitle, getPerformerNames, getCategories, renamePerformerName } = require('./existing-media-parser')

test('single performerName', () => {
  const fileName = 'video.name_piglet.mp4'
  const performerNames = getPerformerNames(fileName)
  expect(performerNames).toEqual(['piglet'])
})

test('multiple performerNames without category', () => {
  const fileName = 'video.name_winnie.the.pooh_piglet.mp4'
  const performerNames = getPerformerNames(fileName)
  expect(performerNames).toEqual(['winnie.the.pooh', 'piglet'])
})

test('performerNames with category', () => {
  const fileName = 'video.name_winnie.the.pooh_piglet_[woz][wiz].mp4'
  const performerNames = getPerformerNames(fileName)
  expect(performerNames).toEqual(['winnie.the.pooh', 'piglet'])
})

test('performerNames when indexified without category', () => {
  const fileName = 'video.name_winnie.the.pooh_piglet_(12).mp4'
  const performerNames = getPerformerNames(fileName)
  expect(performerNames).toEqual(['winnie.the.pooh', 'piglet'])
})

test('exclude performerNames not matching rules', () => {
  const fileName = 'video.name_wab-Foozy_wAb-z_16.10.2017_16-10-2017_piglet.mp4'
  const performerNames = getPerformerNames(fileName)
  expect(performerNames).toEqual(['piglet'])
})

test('title when only title', () => {
  const fileName = 'video.name.mp4'
  const title = getTitle(fileName)
  expect(title).toEqual('video.name')
})

test('title when performers', () => {
  const fileName = 'video.name_piglet.mp4'
  const title = getTitle(fileName)
  expect(title).toEqual('video.name')
})

test('title when performers and categories', () => {
  const fileName = 'video.name_piglet_[woz].mp4'
  const title = getTitle(fileName)
  expect(title).toEqual('video.name')
})

test('rename performer name', () => {
  const fileName = 'video.name_pigglet.mp4'
  const newName = renamePerformerName({
    filePath: fileName,
    fromName: 'pigglet',
    toName: 'piglet'
  })
  expect(newName).toEqual('video.name_piglet.mp4')
})

test('rename performer name with multiple names', () => {
  const fileName = 'video.name_pigglet_winnie_the_pooh.mp4'
  const newName = renamePerformerName({
    filePath: fileName,
    fromName: 'pigglet',
    toName: 'piglet'
  })
  expect(newName).toEqual('video.name_piglet_winnie_the_pooh.mp4')
})

test('rename performer name with categories', () => {
  const fileName = 'video.name_winnie.the.pu_[foo][bar].mp4'
  const newName = renamePerformerName({
    filePath: fileName,
    fromName: 'winnie.the.pu',
    toName: 'winnie.the.pooh'
  })
  expect(newName).toEqual('video.name_winnie.the.pooh_[foo][bar].mp4')
})

test('rename performer name with full path, categories, index and multiple performer names', () => {
  const fileName = '/foo/bar/video.name_pigglet_winnie.the.pooh_[foo][bar]_(100).mp4'
  const newName = renamePerformerName({
    filePath: fileName,
    fromName: 'pigglet',
    toName: 'piglet'
  })
  expect(newName).toEqual('/foo/bar/video.name_piglet_winnie.the.pooh_[foo][bar]_(100).mp4')
})

test('category extraction', () => {
  expect(getCategories('foozzy_waz_[bar].mp4')).toEqual(['bar'])
})

test('category extraction as path', () => {
  expect(getCategories('/foo/bar/foozzy_waz_[bar].mp4')).toEqual(['bar'])
})

test('category extraction on indexed file', () => {
  expect(getCategories('foozzy_waz_[bar]_(1).mp4')).toEqual(['bar'])
})

test('category extraction with hyphen', () => {
  expect(getCategories('foozzy_waz_[woz-waz]_(1).mp4')).toEqual(['woz-waz'])
})

test('multi category extraction', () => {
  expect(getCategories('foozzy_waz_[bar][foo].mp4')).toEqual(['bar', 'foo'])
})

test('category extraction as string', () => {
  expect(getCategories('foozzy_waz_[bar].mp4', true)).toEqual('[bar]')
})

test('multi category extraction as strings', () => {
  expect(getCategories('foozzy_waz_[bar][foo].mp4', true)).toEqual('[bar][foo]')
})
