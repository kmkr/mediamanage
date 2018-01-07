const helper = require('./non-processing-renamer-helper')

test('set categories', () => {
  expect(helper.setCategories(['foo', 'bar'], '/foozzy_waz_[bar].mp4')).toEqual('/foozzy_waz_[foo][bar].mp4')
})

test('set categories on indexed file', () => {
  expect(helper.setCategories(['foo', 'bar'], '/foozzy_waz_[bar]_(2).mp4')).toEqual('/foozzy_waz_[foo][bar]_(2).mp4')
})
