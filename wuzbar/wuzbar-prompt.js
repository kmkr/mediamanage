const CommandPrompt = require("inquirer-command-prompt");

let curPrompt;

module.exports.setPrompt = line => {
  curPrompt.rl.line = line;
  process.stdout.cursorTo(line.length);
  curPrompt.render();
};

class WuzbarPrompt extends CommandPrompt {
  constructor(...args) {
    super(...args);
    curPrompt = this;
  }
  onKeypress(e) {
    curPrompt = this;
    return super.onKeypress(e);
  }
}

module.exports.WuzbarPrompt = WuzbarPrompt;
