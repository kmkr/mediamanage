const test = require('ava');

const nameCleaner = require('./name-cleaner');

test('replace spaces to separator', t => {
    t.true(nameCleaner('ole.brumm\'s nasse.noff') === 'ole.brumm\'s_nasse.noff');
});

test('throws when invalid', t => {
    t.throws(() => nameCleaner('-'));
});

