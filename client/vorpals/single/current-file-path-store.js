const assert = require('assert');
const path = require('path');

let currentFilePath = null;

exports.set = newFilePath => {
    assert(typeof newFilePath === 'string', `Path must be a string. Was ${newFilePath}`);
    assert(path.isAbsolute(newFilePath), `Path must be absolute. Was ${newFilePath}`);
    assert(path.extname(newFilePath), `Path must be a file with extension. Was ${newFilePath}`);
    currentFilePath = newFilePath;
};

exports.unset = () => {
    currentFilePath = null;
};

exports.get = () => {
    assert(currentFilePath, 'Cannot get empty file path');
    return currentFilePath;
};
