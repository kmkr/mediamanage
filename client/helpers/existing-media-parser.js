const path = require('path');

/* eslint-disable no-multi-spaces */
const STORED_FILE_REGEXP = new RegExp(
    '([^_]{5,})' +          // title of at least five chars
    '_' +                   // required title - performer names separator
    '([a-z\'._]+)' +        // at least one performer name
    '_?' +                  // optional performer name - categories separator
    '(\\[\\w+\\])*' +       // zero or more categories
    '(_\\(\\d+\\)){0,1}' +  // zero or one index
    '\\.\\w{2,4}$'          // required file extension
);
/* eslint-enable no-multi-spaces */

function filenameWithExt(filePath) {
    const parsed = path.parse(filePath);
    return `${parsed.name}${parsed.ext}`;
}

exports.getPerformerNames = filePath => {
    const match = filenameWithExt(filePath).match(STORED_FILE_REGEXP);

    if (!match || !match[2]) {
        return [];
    }

    const performerNames = match[2].split('_');
    return performerNames.filter(name => name);
};

exports.getTitle = filePath => {
    const match = filenameWithExt(filePath).match(STORED_FILE_REGEXP);

    if (!match || !match[1]) {
        return path.parse(filePath).name;
    }

    return match[1];
};
