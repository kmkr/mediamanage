const test = require('ava');

const parser = require('./seconds-to-time-parser')()
const parserWithMs = require('./seconds-to-time-parser')(true);

test('parse to seconds', t => {
    t.true(parser(59) === '00:00:59');
});

test('parse to minute', t => {
    t.true(parser(60) === '00:01:00');
});

test('parse to hours', t => {
    t.true(parser(3601) === '01:00:01');
});

test('parse with ms', t => {
    t.true(parserWithMs(1.2) === '00:00:01.200');
});
