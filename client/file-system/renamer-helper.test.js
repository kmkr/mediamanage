const test = require('ava');

const renamerHelper = require('./renamer-helper');

test('set title', t => {
    const fileName = 'file.mp4';
    const actual = renamerHelper.setTitle('my.title', fileName);
    t.is(actual, '(t:my.title)__file.mp4');
});

test('set title with special chars', t => {
    const fileName = 'wobzy.#..[bibzy].mp4';
    const actual = renamerHelper.setTitle('my.title', fileName);
    t.is(actual, '(t:my.title)__wobzy.#..[bibzy].mp4');
});

test('set title with path', t => {
    const fileName = '/a/path/file.mp4';
    const actual = renamerHelper.setTitle('my.title', fileName);
    t.is(actual, '/a/path/(t:my.title)__file.mp4');
});

test('overwrite title', t => {
    const fileName = '(t:my.title)__file.mp4';
    const actual = renamerHelper.setTitle('my.new.title', fileName);
    t.is(actual, '(t:my.new.title)__file.mp4');
});

test('set title with categories', t => {
    const fileName = '(c:[foo][bar])__file.mp4';
    const actual = renamerHelper.setTitle('my.new.title', fileName);
    t.is(actual, '(t:my.new.title)_(c:[foo][bar])__file.mp4');
});

test('overwrite title with categories', t => {
    const fileName = '(t:my.title)_(c:[foo][bar])__file.mp4';
    const actual = renamerHelper.setTitle('my.new.title', fileName);
    t.is(actual, '(t:my.new.title)_(c:[foo][bar])__file.mp4');
});

test('set title with categories and performers', t => {
    const fileName = '(p:ole.brumm_nasse.noff)_(c:[foo][bar])__file.mp4';
    const actual = renamerHelper.setTitle('my.new.title', fileName);
    t.is(actual, '(t:my.new.title)_(p:ole.brumm_nasse.noff)_(c:[foo][bar])__file.mp4');
});

test('overwrite title with categories and performers', t => {
    const fileName = '(t:my.title)_(p:ole.brumm_nasse.noff)_(c:[foo][bar])__file.mp4';
    const actual = renamerHelper.setTitle('my.new.title', fileName);
    t.is(actual, '(t:my.new.title)_(p:ole.brumm_nasse.noff)_(c:[foo][bar])__file.mp4');
});

test('set categories', t => {
    const fileName = '(p:brumm)__file.mp4';
    const actual = renamerHelper.setCategories(['woz'], fileName);
    t.is(actual, '(p:brumm)_(c:[woz])__file.mp4');
});

test('set categories with path', t => {
    const fileName = '/(p:brumm)__file.mp4';
    const actual = renamerHelper.setCategories(['woz'], fileName);
    t.is(actual, '/(p:brumm)_(c:[woz])__file.mp4');
});

test('overwrite categories', t => {
    const fileName = '(t:my.title)_(p:brumm)_(c:[foo][bar])__file.mp4';
    const actual = renamerHelper.setCategories(['woz'], fileName);
    t.is(actual, '(t:my.title)_(p:brumm)_(c:[woz])__file.mp4');
});

test('keep underscores in original title when no new title is set', t => {
    const fileName = 'my_original_file.mp4';
    const actual = renamerHelper.setCategories(['waz'], fileName);
    t.is(actual, '(c:[waz])__my_original_file.mp4');
});

test('set performer', t => {
    const fileName = '(c:[woz])__file.mp4';
    const actual = renamerHelper.setPerformerNames(['olebrumm'], fileName);
    t.is(actual, '(p:olebrumm)_(c:[woz])__file.mp4');
});

test('set performer with path', t => {
    const fileName = '/wizzy/(c:[woz])__file.mp4';
    const actual = renamerHelper.setPerformerNames(['olebrumm'], fileName);
    t.is(actual, '/wizzy/(p:olebrumm)_(c:[woz])__file.mp4');
});

test('set performers', t => {
    const fileName = '(c:[woz])__file.mp4';
    const actual = renamerHelper.setPerformerNames(['ole.brumm', 'nasse.noff'], fileName);
    t.is(actual, '(p:ole.brumm_nasse.noff)_(c:[woz])__file.mp4');
});

test('overwrite performers', t => {
    const fileName = '(t:my.title)_(p:brumm)_(c:[woz])__file.mp4';
    const actual = renamerHelper.setPerformerNames(['noff'], fileName);
    t.is(actual, '(t:my.title)_(p:noff)_(c:[woz])__file.mp4');
});

test('clean file name', t => {
    const fileName = '(t:my.title)_(p:ole.brumm)_(c:[woz])__file.mp4';
    const actual = renamerHelper.cleanFilePath(fileName);
    t.is(actual, 'my.title_ole.brumm_[woz].mp4');
});

test('clean file name without anything set', t => {
    const fileName = 'my.file.mp4';
    const actual = renamerHelper.cleanFilePath(fileName);
    t.is(actual, 'my.file.mp4');
});

test('clean file name with performer and category, but without title', t => {
    const fileName = '(p:noff)_(c:[waz])__my.file.mp4';
    const actual = renamerHelper.cleanFilePath(fileName);
    t.is(actual, 'my.file_noff_[waz].mp4');
});

test('clean file name with underscored name and category, but without title', t => {
    const fileName = '(c:[waz])__my_underscored_file.mp4';
    const actual = renamerHelper.cleanFilePath(fileName);
    t.is(actual, 'my_underscored_file_[waz].mp4');
});

test('clean file path without title and spaces in name', t => {
    const fileName = '/foo/bar/(c:[waz])__Wobzy Wabzy - Bobzy Bubzy.mp4';
    const actual = renamerHelper.cleanFilePath(fileName);
    t.is(actual, '/foo/bar/Wobzy Wabzy - Bobzy Bubzy_[waz].mp4');
});

test('clean file name with double underscore in folder name', t => {
    const fileName = '/woo/__waa/wii/(t:wobzy.bobzy)_(p:ole.b_noff)_(c:[wiz])__Wo wu, Bo by, Wi wa - ci fi [WoolB].mp4';
    const actual = renamerHelper.cleanFilePath(fileName);
    t.is(actual, '/woo/__waa/wii/wobzy.bobzy_ole.b_noff_[wiz].mp4');
});

test('indexify without index', t => {
    const fileName = 'foo-bar.mp4';
    const actual = renamerHelper.indexify(fileName);
    t.is(actual, 'foo-bar_(1).mp4');
});

test('indexify with index', t => {
    const fileName = 'foo-bar_(10).mp4';
    const actual = renamerHelper.indexify(fileName);
    t.is(actual, 'foo-bar_(11).mp4');
});
