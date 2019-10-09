const Promise = require("bluebird");

Promise.promisifyAll(require("fs"));
Promise.promisifyAll(require("mkdirp"));

const multiCommands = require("./multi-commands");
const singleCommands = require("./single-commands");

// const singleFileVorpal = require("./vorpals/single-file-vorpal");

// function showMultiFile() {
//   const multiFileVorpal = require("./vorpals/multi-file-vorpal")(filePath => {
//     const vorpalInstance = singleFileVorpal(filePath, showMultiFile);
//     vorpalInstance.history("mediamanage-single");
//     vorpalInstance.show();
//   });
//   multiFileVorpal.history("mediamanage-multi");
//   multiFileVorpal.show();
// }

// showMultiFile();

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
