const inquirer = require("inquirer");
const leftPad = require("left-pad");

const parser = require("./parser");

inquirer.registerPrompt("command", require("./wuzbar-prompt").WuzbarPrompt);

function getKey(input) {
  return input.split(" ")[0];
}

module.exports = async ({ commands, context = 0, prompt }) => {
  const commandKeys = commands.map(command => getKey(command.prompt));

  function getCommand(line) {
    return commands.find(command => getKey(command.prompt) === getKey(line));
  }

  function logHelp() {
    const leftPadSize = Math.max(
      ...commands.map(command => command.prompt.length)
    );
    console.log("\nAvailable commands\n");
    commands.forEach(command => {
      console.log(
        `${leftPad(command.prompt, leftPadSize + 5)} - ${command.description}`
      );
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
          return err.message;
        }
        return true;
      },
      autoCompletion(line) {
        const command = getCommand(line);
        if (command && command.autocomplete) {
          const autocompleted = command.autocomplete();
          if (Array.isArray(autocompleted)) {
            return autocompleted;
          }
          if (typeof autocompleted === "string") {
            return [autocompleted];
          }
          throw new Error(
            `Unable to handle autocomplete value ${autocompleted}`
          );
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
