const renamerHelper = require('./on-processing-renamer-helper')

test('set title', () => {
  const fileName = 'file.mp4'
  const actual = renamerHelper.setTitle('my.title', fileName)
  expect(actual).toBe('(t:my.title)__file.mp4')
})

test('set title with special chars', () => {
  const fileName = 'wobzy.#..[bibzy].mp4'
  const actual = renamerHelper.setTitle('my.title', fileName)
  expect(actual).toBe('(t:my.title)__wobzy.#..[bibzy].mp4')
})

test('set title with path', () => {
  const fileName = '/a/path/file.mp4'
  const actual = renamerHelper.setTitle('my.title', fileName)
  expect(actual).toBe('/a/path/(t:my.title)__file.mp4')
})

test('overwrite title', () => {
  const fileName = '(t:my.title)__file.mp4'
  const actual = renamerHelper.setTitle('my.new.title', fileName)
  expect(actual).toBe('(t:my.new.title)__file.mp4')
})

test('set title with categories', () => {
  const fileName = '(c:[foo][bar])__file.mp4'
  const actual = renamerHelper.setTitle('my.new.title', fileName)
  expect(actual).toBe('(t:my.new.title)_(c:[foo][bar])__file.mp4')
})

test('overwrite title with categories', () => {
  const fileName = '(t:my.title)_(c:[foo][bar])__file.mp4'
  const actual = renamerHelper.setTitle('my.new.title', fileName)
  expect(actual).toBe('(t:my.new.title)_(c:[foo][bar])__file.mp4')
})

test('set title with categories and performers', () => {
  const fileName = '(p:ole.brumm_nasse.noff)_(c:[foo][bar])__file.mp4'
  const actual = renamerHelper.setTitle('my.new.title', fileName)
  expect(actual).toBe('(t:my.new.title)_(p:ole.brumm_nasse.noff)_(c:[foo][bar])__file.mp4')
})

test('overwrite title with categories and performers', () => {
  const fileName = '(t:my.title)_(p:ole.brumm_nasse.noff)_(c:[foo][bar])__file.mp4'
  const actual = renamerHelper.setTitle('my.new.title', fileName)
  expect(actual).toBe('(t:my.new.title)_(p:ole.brumm_nasse.noff)_(c:[foo][bar])__file.mp4')
})

test('set categories', () => {
  const fileName = '(p:brumm)__file.mp4'
  const actual = renamerHelper.setCategories(['woz'], fileName)
  expect(actual).toBe('(p:brumm)_(c:[woz])__file.mp4')
})

test('set categories with path', () => {
  const fileName = '/(p:brumm)__file.mp4'
  const actual = renamerHelper.setCategories(['woz'], fileName)
  expect(actual).toBe('/(p:brumm)_(c:[woz])__file.mp4')
})

test('overwrite categories', () => {
  const fileName = '(t:my.title)_(p:brumm)_(c:[foo][bar])__file.mp4'
  const actual = renamerHelper.setCategories(['woz'], fileName)
  expect(actual).toBe('(t:my.title)_(p:brumm)_(c:[woz])__file.mp4')
})

test('get categories', () => {
  const fileName = '(c:[woz])__file.mp4'
  const categories = renamerHelper.getCategories(fileName)
  expect(categories).toEqual(['woz'])
})

test('get categories is empty when missing', () => {
  const fileName = 'file.mp4'
  const categories = renamerHelper.getCategories(fileName)
  expect(categories).toEqual([])
})

test('keep underscores in original title when no new title is set', () => {
  const fileName = 'my_original_file.mp4'
  const actual = renamerHelper.setCategories(['waz'], fileName)
  expect(actual).toBe('(c:[waz])__my_original_file.mp4')
})

test('category with dash', () => {
  const fileName = 'my_original_file.mp4'
  const actual = renamerHelper.setCategories(['waz-woz', 'wiz'], fileName)
  expect(actual).toBe('(c:[waz-woz][wiz])__my_original_file.mp4')
})

test('set performer', () => {
  const fileName = '(c:[woz])__file.mp4'
  const actual = renamerHelper.setPerformerNames(['olebrumm'], fileName)
  expect(actual).toBe('(p:olebrumm)_(c:[woz])__file.mp4')
})

test('set performer with path', () => {
  const fileName = '/wizzy/(c:[woz])__file.mp4'
  const actual = renamerHelper.setPerformerNames(['olebrumm'], fileName)
  expect(actual).toBe('/wizzy/(p:olebrumm)_(c:[woz])__file.mp4')
})

test('set performers', () => {
  const fileName = '(c:[woz])__file.mp4'
  const actual = renamerHelper.setPerformerNames(['ole.brumm', 'nasse.noff'], fileName)
  expect(actual).toBe('(p:ole.brumm_nasse.noff)_(c:[woz])__file.mp4')
})

test('overwrite performers', () => {
  const fileName = '(t:my.title)_(p:brumm)_(c:[woz])__file.mp4'
  const actual = renamerHelper.setPerformerNames(['noff'], fileName)
  expect(actual).toBe('(t:my.title)_(p:noff)_(c:[woz])__file.mp4')
})

test('clean file name', () => {
  const fileName = '(t:my.title)_(p:ole.brumm)_(c:[woz])__file.mp4'
  const actual = renamerHelper.cleanFilePath(fileName)
  expect(actual).toBe('my.title_ole.brumm_[woz].mp4')
})

test('clean file name without anything set', () => {
  const fileName = 'my.file.mp4'
  const actual = renamerHelper.cleanFilePath(fileName)
  expect(actual).toBe('my.file.mp4')
})

test('clean file name with performer and category, but without title', () => {
  const fileName = '(p:noff)_(c:[waz])__my.file.mp4'
  const actual = renamerHelper.cleanFilePath(fileName)
  expect(actual).toBe('my.file_noff_[waz].mp4')
})

test('clean file name with performer, with indexified old title', () => {
  const fileName = '(p:noff)__my.file_(1).mp4'
  const actual = renamerHelper.cleanFilePath(fileName)
  expect(actual).toBe('my.file_noff.mp4')
})

test('clean file name with underscored name and category, but without title', () => {
  const fileName = '(c:[waz])__my_underscored_file.mp4'
  const actual = renamerHelper.cleanFilePath(fileName)
  expect(actual).toBe('my_underscored_file_[waz].mp4')
})

test('clean file path without title and spaces in name', () => {
  const fileName = '/foo/bar/(c:[waz])__Wobzy Wabzy - Bobzy Bubzy.mp4'
  const actual = renamerHelper.cleanFilePath(fileName)
  expect(actual).toBe('/foo/bar/Wobzy Wabzy - Bobzy Bubzy_[waz].mp4')
})

test('clean file name with double underscore in folder name', () => {
  const fileName = '/woo/__waa/wii/(t:wobzy.bobzy)_(p:ole.b_noff)_(c:[wiz])__Wo wu, Bo by, Wi wa - ci fi [WoolB].mp4'
  const actual = renamerHelper.cleanFilePath(fileName)
  expect(actual).toBe('/woo/__waa/wii/wobzy.bobzy_ole.b_noff_[wiz].mp4')
})

test('indexify without index', () => {
  const fileName = 'foo-bar.mp4'
  const actual = renamerHelper.indexify(fileName)
  expect(actual).toBe('foo-bar_(1).mp4')
})

test('indexify with index', () => {
  const fileName = 'foo-bar_(10).mp4'
  const actual = renamerHelper.indexify(fileName)
  expect(actual).toBe('foo-bar_(11).mp4')
})
