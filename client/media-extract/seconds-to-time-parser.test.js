const parser = require('./seconds-to-time-parser')();
const parserWithMs = require('./seconds-to-time-parser')(true);

test('parse to seconds', () => {
    expect(parser(59) === '00:00:59').toBe(true);
});

test('parse to minute', () => {
    expect(parser(60) === '00:01:00').toBe(true);
});

test('parse to hours', () => {
    expect(parser(3601) === '01:00:01').toBe(true);
});

test('parse with ms', () => {
    expect(parserWithMs(1.2) === '00:00:01.200').toBe(true);
});
