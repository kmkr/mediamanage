module.exports = filePath => {
    return filePath
        .replace(process.cwd(), '')
        .replace(/^\//, ''));
}
