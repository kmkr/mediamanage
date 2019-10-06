module.exports = filePath => {
  let cwd;
  try {
    cwd = process.cwd();
  } catch (err) {
    if (err.code === "ENOENT") {
      return filePath;
    }
    throw err;
  }
  if (filePath.includes(cwd)) {
    return filePath.replace(cwd, "").replace(/^\//, "");
  }

  return filePath;
};
