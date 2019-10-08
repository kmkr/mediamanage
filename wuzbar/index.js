const inquirer = require("inquirer");

const parser = require("./parser");

inquirer.registerPrompt("command", require("inquirer-command-prompt"));

function getKey(input) {
  return input.split(" ")[0];
}

module.exports = async ({ commands, context = 0, prompt }) => {
  const commandKeys = commands.map(command => getKey(command.prompt));

  function getCommand(line) {
    return commands.find(command => getKey(command.prompt) === getKey(line));
  }

  function logHelp() {
    console.log("Available commands");
    commands.forEach(command => {
      console.log(command.prompt);
    });
  }

  const { cmd } = await inquirer.prompt([
    {
      type: "command",
      name: "cmd",
      message: prompt,
      validate: line => {
        const command = getCommand(line);
        if (!command) {
          return true;
        }
        try {
          const data = parser(command.prompt, line);
          if (command && command.validate) {
            return command.validate(data);
          }
        } catch (err) {
          console.log("Unable to parse command prompt", err);
          return false;
        }
        return true;
      },
      autoCompletion(line) {
        const command = getCommand(line);
        if (command && command.autoComplete) {
          return command.autoComplete();
        }
        return commandKeys;
      },
      context
    }
  ]);

  const command = getCommand(cmd);

  if (!command) {
    logHelp();
    return;
  }

  return command.handle(parser(command.prompt, cmd));
};
