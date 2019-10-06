const chalk = require("chalk");
const fs = require("fs");
const mkdirp = require("mkdirp");
const logger = require("../vorpals/logger");

module.exports = async (path, vorpalInstance) => {
  try {
    return await fs.readdirAsync(path);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
    const { create } = await vorpalInstance.activeCommand.prompt({
      message: `${chalk.yellow(
        path
      )} does not exist, do you want to create it?`,
      name: "create",
      type: "confirm"
    });
    if (create) {
      await mkdirp.mkdirpAsync(path);
    } else {
      logger.log(`Won't create ${path} - continuing`);
    }
    return [];
  }
};
