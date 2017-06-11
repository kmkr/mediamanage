const test = require('ava');

const findCommonPartsInStrings = require('../helpers/find-common-parts-in-strings');

test('finds common parts', t => {
    const strings = [
        '/foo/bar/waz/woz.mp4',
        '/foo/bar/waz/wiz/boz.mp4',
        '/foo/bar/wuz/woz.mp4'
    ];
    t.is(findCommonPartsInStrings(strings), '/foo/bar');
});
