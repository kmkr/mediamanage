const CommandPrompt = require("inquirer-command-prompt");
const ansiEscapes = require("ansi-escapes");

let curPrompt;

module.exports.setPrompt = line => {
  curPrompt.rl.line = line;
  // todo: move cursor to end of line
  // curPrompt.rl.output.unmute();
  // curPrompt.rl.output.write(ansiEscapes.cursorForward(line.length));
  // curPrompt.rl.output.mute();
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
