const findCommonPartsInStrings = require('./find-common-parts-in-strings');

test('finds common parts', () => {
    const strings = [
        '/foo/bar/waz/woz.mp4',
        '/foo/bar/waz/wiz/boz.mp4',
        '/foo/bar/wuz/woz.mp4'
    ];
    expect(findCommonPartsInStrings(strings)).toBe('/foo/bar');
});
