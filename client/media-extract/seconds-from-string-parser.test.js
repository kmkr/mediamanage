const test = require('ava');

const parser = require('./seconds-from-string-parser');

test('parse seconds', t => {
    t.true(parser('60') === 60);
});

test('parse minutes', t => {
    t.true(parser('1.20') === 80);
});

test('parse hours', t => {
    t.true(parser('1.1.1') === 3661);
});
