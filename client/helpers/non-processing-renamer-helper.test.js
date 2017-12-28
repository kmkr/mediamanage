const helper = require('./non-processing-renamer-helper')

test('that name is considered processed', () => {
  [
    'foozzy_waz_[bar].mp4',
    'foozzy_waz.woz_[bar].mp4',
    'foozzy_waz.woz_biz.boz_[bar].mp4',
    'foozzy_waz.woz_biz.boz_[bar][biz].mp4',
    'foozzy_waz.woz_biz.boz_[bar][biz]_(1).mp4'
  ].forEach(fileName => {
    expect(helper.isProcessed(fileName)).toBeTruthy()
  })
})

test('that name is not considered processed', () => {
  [
    '[biz].mp4',
    'foozzy.mp4',
    'foozzy_[bar].mp4',
    'foozzy_waz.woz_biz.boz.mp4',
    'foozzy_[bar][biz].mp4'
  ].forEach(fileName => {
    expect(helper.isProcessed(fileName)).toBeFalsy()
  })
})

test('set categories', () => {
  expect(helper.setCategories(['foo', 'bar'], '/foozzy_waz_[bar].mp4')).toEqual('/foozzy_waz_[foo][bar].mp4')
})

test('set categories on indexed file', () => {
  expect(helper.setCategories(['foo', 'bar'], '/foozzy_waz_[bar]_(2).mp4')).toEqual('/foozzy_waz_[foo][bar]_(2).mp4')
})
