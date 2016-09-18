const PERFORMER_SEPARATOR = '_';
const ALLOWED_CHARS = /^[\w\._']*$/i;

module.exports = (uncleaned = '') => {
    const cleaned = uncleaned.replace(/\s/g, PERFORMER_SEPARATOR);
    if (!cleaned.match(ALLOWED_CHARS)) {
        throw new Error(`Invalid name ${cleaned}`);
    }

    return cleaned;
};
