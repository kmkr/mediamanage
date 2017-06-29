const chalk = require('vorpal')().chalk;
jest.mock('../vorpals/logger', () => ({
    log: jest.fn()
}));

const printPathsService = require('./print-paths-service');
const logMock = require('../vorpals/logger');

beforeEach(() => {
    jest.resetAllMocks();
});

test('print paths as strings with sub dirs', () => {
    const paths = [
        'waz.mp4',
        '/wizzy/wozzy.mp4',
        '/bozzy/bazzy/wozzy.mp4'
    ];
    printPathsService.asList(paths);

    const calls = logMock.log.mock.calls;
    expect(calls.length).toBe(paths.length);
    expect(calls[0][0]).toEqual(`0)              ${chalk.green('waz.mp4')}`);
    expect(calls[1][0]).toEqual(`1)       /wizzy/${chalk.green('wozzy.mp4')}`);
    expect(calls[2][0]).toEqual(`2) /bozzy/bazzy/${chalk.green('wozzy.mp4')}`);
});

test('print 10+ paths as strings', () => {
    const paths = [
        '/foo/bar/waz.mp4',
        '/wizzy/wozzy.mp4',
        '/bozzy/wozzy.mp4',
        '/wiz/wozzy.mp4',
        '/waz/wozzy.mp4',
        '/wubz/wozzy.mp4',
        '/wurf/wozzy.mp4',
        '/burf/wozzy.mp4',
        '/barf/wozzy.mp4',
        '/brurf/wozzy.mp4',
        '/birf/wozzy.mp4'
    ];
    printPathsService.asList(paths);

    const calls = logMock.log.mock.calls;
    expect(calls.length).toBe(paths.length);
    expect(calls[0][0]).toEqual(` 0) /foo/bar/${chalk.green('waz.mp4')}`);
    expect(calls[1][0]).toEqual(` 1)   /wizzy/${chalk.green('wozzy.mp4')}`);
    expect(calls[10][0]).toEqual(`10)    /birf/${chalk.green('wozzy.mp4')}`);
});

test('print paths as data objects hides but keeps index', () => {
    const paths = [
        { value: '/foo/bar/waz.mp4', hidden: false },
        { value: '/bar/boz.mp4', hidden: true },
        { value: '/foo/wizzaru', hidden: false }
    ];
    printPathsService.asList(paths);

    const calls = logMock.log.mock.calls;
    expect(calls.length).toBe(2);
    expect(calls[0][0]).toEqual(`0) /foo/bar/${chalk.green('waz.mp4')}`);
    expect(calls[1][0]).toEqual(`2)     /foo/${chalk.green('wizzaru')}`);
});

test('print paths as pairs', () => {
    const sourceFilePaths = [
        '/foo/bar/woz/waz/wiz.mp4',
        '/foo/baz/wizzy.mp4'
    ];

    const destFilePaths = [
        '/foo/me/mu/ma/wiz.mp4',
        '/foo/bo/be/baz/burb/wizzy.mp4'
    ];
    printPathsService.asPairsOfLists({ sourceFilePaths, destFilePaths });

    const calls = logMock.log.mock.calls;
    expect(calls.length).toBe(2);
    expect(calls[0][0]).toEqual(`${chalk.yellow('{..}bar/woz/waz')}/wiz.mp4 → ${chalk.green('{..}me/mu/ma')}/wiz.mp4`);
    expect(calls[1][0]).toEqual(`${chalk.yellow('        {..}baz')}/wizzy.mp4 → ${chalk.green('{..}bo/be/baz/burb')}/wizzy.mp4`);
});
