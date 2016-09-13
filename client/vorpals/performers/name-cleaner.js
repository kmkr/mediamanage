const PERFORMER_SEPARATOR = '_';
const NAME_SEPARATOR = '.';
const ALLOWED_CHARS = /^[\w\._']*$/;

module.exports = (uncleaned = '') => {
    const cleaned = uncleaned.replace(/\s/g, PERFORMER_SEPARATOR);
    if (!cleaned.match(ALLOWED_CHARS)) {
        throw new Error(`Invalid name ${cleaned}`);
    }

    return cleaned;
};
