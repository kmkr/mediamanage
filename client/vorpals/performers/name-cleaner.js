const PERFORMER_SEPARATOR = '_';
const NAME_SEPARATOR = '.';

module.exports = (uncleaned = '') => {
    return uncleaned.replace(/\s/g, PERFORMER_SEPARATOR);
};
