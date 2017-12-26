const helper = require('./non-processing-renamer-helper')

test('that name is considered processed', () => {
  [
    'foo_waz_[bar].mp4',
    'foo_waz.woz_[bar].mp4',
    'foo_waz.woz_biz.boz_[bar].mp4',
    'foo_waz.woz_biz.boz_[bar][biz].mp4',
    'foo_waz.woz_biz.boz_[bar][biz]_(1).mp4'
  ].forEach(fileName => {
    expect(helper.isProcessed(fileName)).toBeTruthy()
  })
})

test('that name is not considered processed', () => {
  [
    '[biz].mp4',
    'foo.mp4',
    'foo_[bar].mp4',
    'foo_waz.woz_biz.boz.mp4',
    'foo_[bar][biz].mp4'
  ].forEach(fileName => {
    expect(helper.isProcessed(fileName)).toBeFalsy()
  })
})

test('category extraction', () => {
  expect(helper.getCategories('foo_waz_[bar].mp4')).toEqual(['bar'])
})

test('category extraction on indexed file', () => {
  expect(helper.getCategories('foo_waz_[bar]_(1).mp4')).toEqual(['bar'])
})

test('multi category extraction', () => {
  expect(helper.getCategories('foo_waz_[bar][foo]')).toEqual(['bar', 'foo'])
})

test('set categories', () => {
  expect(helper.setCategories(['foo', 'bar'], '/foo_waz_[bar].mp4')).toEqual('/foo_waz_[foo][bar].mp4')
})

test('set categories on indexed file', () => {
  expect(helper.setCategories(['foo', 'bar'], '/foo_waz_[bar]_(2).mp4')).toEqual('/foo_waz_[foo][bar]_(2).mp4')
})
