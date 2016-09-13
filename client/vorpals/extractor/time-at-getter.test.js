const test = require('ava');

const timeAtGetter = require('./time-at-getter');

test('parse without performer info', t => {
    t.deepEqual(timeAtGetter('1.5 2.5'), {
        startsAtSeconds: 65,
        endsAtSeconds: 125,
        performerInfo: ''
    });
});

test('parse with performer info', t => {
    t.deepEqual(timeAtGetter('nasse ole.brumm@1.5 2.5'), {
        startsAtSeconds: 65,
        endsAtSeconds: 125,
        performerInfo: 'nasse_ole.brumm'
    });
});
