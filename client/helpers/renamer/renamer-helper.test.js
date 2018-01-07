const onProcessing = require('./on-processing-renamer-helper')
const nonProcessesing = require('./non-processing-renamer-helper')

const getHelper = require('./index')

test('that nonProcessing is used', () => {
  [
    'foozzy_waz_[bar].mp4',
    'foozzy_waz.woz_[bar].mp4',
    'foozzy_waz.woz_biz.boz_[bar].mp4',
    'foozzy_waz.woz_biz.boz_[bar][biz].mp4',
    'foozzy_waz.woz_biz.boz_[bar][biz]_(1).mp4'
  ].forEach(fileName => {
    expect(getHelper(fileName)).toBe(nonProcessesing)
  })
})

test('that processing is used', () => {
  [
    '[biz].mp4',
    'foozzy.mp4',
    'foozzy_[bar].mp4',
    'foozzy_waz.woz_biz.boz.mp4',
    'foozzy_[bar][biz].mp4',
    '(c:[fii]__foozzy.mp4',
    '(c:[fii](p:hey)__foozzy.mp4',
    '(t:hey.you)(c:[fii](p:hey)__foozzy.mp4'
  ].forEach(fileName => {
    expect(getHelper(fileName)).toBe(onProcessing)
  })
})
