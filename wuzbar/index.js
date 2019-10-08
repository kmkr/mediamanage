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

  const { cmd } = await inquirer.prompt([
    {
      type: "command",
      name: "cmd",
      message: prompt,
      validate: line => {
        const command = getCommand(line);
        try {
          const data = parser(command.prompt, line);
          if (command && command.validate) {
            return command.validate(data);
          }
        } catch (err) {
          console.log("Invalid", err);
          return false;
        }
        return true;
      },
      autoCompletion(line) {
        console.log("Checking autocomplete for ", line);
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
    console.log("No command found");
    return;
  }

  return command.handle(parser(command.prompt, cmd));
};
