const test = require('ava');

const mediaExtract = require('./index');

test('validate', t => {
    const arg = {
        from: 0,
        to: 1,
        performerNames: [
            'ole.brumm'
        ]
    };
    t.true(mediaExtract.validate(arg));
});

test('support for string input', t => {
    const arg = {
        from: '1.2.3',
        to: '1.2.4',
        performerNames: [
            'ole.brumm'
        ]
    };
    t.true(mediaExtract.validate(arg));
});

test('invalid when from is before to', t => {
    const arg = {
        from: 1,
        to: 0,
        performerNames: [
            'ole.brumm'
        ]
    };
    t.true(!mediaExtract.validate(arg));
});


test('invalid when from is before to with strings', t => {
    const arg = {
        from: '1.2.3',
        to: '1.2.2',
        performerNames: [
            'ole.brumm'
        ]
    };
    t.true(!mediaExtract.validate(arg));
});

