module.exports = filePath => {
    const {cwd} = process;
    if (filePath.includes(cwd)) {
        return filePath
            .replace(process.cwd(), '')
            .replace(/^\//, '');
    }

    return filePath;
};
