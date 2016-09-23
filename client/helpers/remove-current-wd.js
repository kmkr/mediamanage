module.exports = filePath => {
    const cwd = process.cwd();
    if (filePath.includes(cwd)) {
        return filePath
            .replace(cwd, '')
            .replace(/^\//, '');
    }

    return filePath;
};
