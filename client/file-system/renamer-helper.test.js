const test = require('ava');

const renamerHelper = require('./renamer-helper');

test('set title', t => {
    const fileName = 'file.mp4';
    const actual = renamerHelper.setTitle('my.title', fileName);
    t.is(actual, '(t:my.title)__file.mp4');
});

test('set title with path throws', t => {
    const fileName = '/a/path/file.mp4';
    t.throws(() => renamerHelper.setTitle('my.title', fileName));
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

test('set categories with path throws', t => {
    const fileName = '/(p:brumm)__file.mp4';
    t.throws(() => renamerHelper.setCategories(['woz'], fileName));
});

test('overwrite categories', t => {
    const fileName = '(t:my.title)_(p:brumm)_(c:[foo][bar])__file.mp4';
    const actual = renamerHelper.setCategories(['woz'], fileName);
    t.is(actual, '(t:my.title)_(p:brumm)_(c:[woz])__file.mp4');
});

test('set performer', t => {
    const fileName = '(c:[woz])__file.mp4';
    const actual = renamerHelper.setPerformerNames('olebrumm', fileName);
    t.is(actual, '(p:olebrumm)_(c:[woz])__file.mp4');
});

test('set performers', t => {
    const fileName = '(c:[woz])__file.mp4';
    const actual = renamerHelper.setPerformerNames('ole.brumm_nasse.noff', fileName);
    t.is(actual, '(p:ole.brumm_nasse.noff)_(c:[woz])__file.mp4');
});

test('overwrite performers', t => {
    const fileName = '(t:my.title)_(p:brumm)_(c:[woz])__file.mp4';
    const actual = renamerHelper.setPerformerNames('noff', fileName);
    t.is(actual, '(t:my.title)_(p:noff)_(c:[woz])__file.mp4');
});

test('clean file name', t => {
    const fileName = '(t:my.title)_(p:ole.brumm)_(c:[woz])__file.mp4';
    const actual = renamerHelper.cleanFileName(fileName);
    t.is(actual, 'my.title_ole.brumm_[woz].mp4');
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
