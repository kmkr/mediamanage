const parser = require('./seconds-to-time-parser')();
const parserWithoutPadding = require('./seconds-to-time-parser')({ separator: '.', padZeros: false });

test('parse to seconds', () => {
    expect(parser(59)).toBe('00:00:59');
});

test('parse to minute', () => {
    expect(parser(60)).toBe('00:01:00');
});

test('parse to hours', () => {
    expect(parser(3601)).toBe('01:00:01');
});

test('parse without padding', () => {
    expect(parserWithoutPadding(65)).toBe('0.1.5');
    expect(parserWithoutPadding(3601)).toBe('1.0.1');
});
