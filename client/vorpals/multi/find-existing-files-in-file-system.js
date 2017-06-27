const Vorpal = require('vorpal');
const chalk = Vorpal().chalk; // eslint-disable-line new-cap
const searchForExistingMediaService = require('../../existing-media-search/search-for-existing-media-service');

module.exports = function (vorpal) {
    vorpal
        .command('f <searchText>', 'Find existing files by searching file system')
        .action(() => {
            vorpal.ui.redraw.clear();
            return Promise.resolve();
        });

    vorpal.on('keypress', ({ value }) => {
        if (!value) {
            return;
        }
        const match = value.match(/f (.*)/);
        if (!match) {
            return;
        }
        const searchText = match[1];
        if (searchText) {
            const hits = searchForExistingMediaService.byText(searchText, false);
            vorpal.ui.redraw(hits.reduce((prevVal, curVal) => {
                const { sourcePath, filePath } = curVal;
                return `${prevVal}${sourcePath}${chalk.yellow(filePath.replace(sourcePath, ''))}\n`;
            }, ''));
        }
    });
};
