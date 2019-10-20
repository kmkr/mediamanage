const Promise = require("bluebird");

Promise.promisifyAll(require("fs"));
Promise.promisifyAll(require("mkdirp"));

const multiCommands = require("./multi-commands");
const singleCommands = require("./single-commands");

process.on("uncaughtException", err => {
  throw err;
});

async function runMulti() {
  return await multiCommands({
    onSelectFile: async filePath => {
      await singleCommands(filePath);
    }
  });
}

runMulti().catch(err => {
  console.error(err);
});
