const path = require('path');

/* eslint-disable no-multi-spaces */
const STORED_FILE_REGEXP = new RegExp(
    '([^_]{5,})' +          // title of at least five chars
    '_' +                   // required title - performer names separator
    '([a-z\'._]{4,})' +     // at least one performer name, four chars minimum
    '(\\[\\w+\\])*' +       // zero or more categories
    '(_\\(\\d+\\)){0,1}' +  // zero or one index
    '\\.\\w{2,4}$'          // required file extension
);
/* eslint-enable no-multi-spaces */

function filenameWithExt(filePath) {
    const parsed = path.parse(filePath);
    return `${parsed.name}${parsed.ext}`;
}

function getPerformerNames(filePath) {
    const match = filenameWithExt(filePath).match(STORED_FILE_REGEXP);

    if (!match || !match[2]) {
        return [];
    }

    const performerNames = match[2].split('_');
    return performerNames.filter(name => name);
}

exports.getPerformerNames = getPerformerNames;

exports.getTitle = filePath => {
    const match = filenameWithExt(filePath).match(STORED_FILE_REGEXP);

    if (!match || !match[1]) {
        return path.parse(filePath).name;
    }

    return match[1];
};

exports.renamePerformerName = ({ filePath, fromName, toName }) => {
    const newFileName = filenameWithExt(filePath).replace(STORED_FILE_REGEXP, (match, matchedTitle, matchedPerformerNames) => {
        const strippedFromTrailingUnderscore = matchedPerformerNames.replace(/_$/, '');
        const newPerformerNames = getPerformerNames(filePath)
            .map(name => name === fromName ? toName : name);

        return match.replace(`_${strippedFromTrailingUnderscore}`, `_${newPerformerNames.join('_')}`);
    });

    const { dir } = path.parse(filePath);

    return dir ? `${dir}${path.sep}${newFileName}` : newFileName;
};
