const START_OPTIONAL_ARG = /^\[/;
const END_OPTIONAL_ARG = /\]$/;
const START_REQUIRED_ARG = /^</;
const END_REQUIRED_ARG = />$/;
const REST_ARG = "...";

function cleanKeyName(keyName) {
  const replace = [
    START_OPTIONAL_ARG,
    END_OPTIONAL_ARG,
    START_REQUIRED_ARG,
    END_REQUIRED_ARG,
    REST_ARG
  ];
  return replace.reduce(
    (keyName, curReplace) => keyName.replace(curReplace, ""),
    keyName
  );
}

function isRest(keyName) {
  return keyName.slice(1).startsWith("...");
}

function isRequired(keyName) {
  const regExp = new RegExp(
    START_REQUIRED_ARG.source + ".*" + END_REQUIRED_ARG.source
  );
  return regExp.test(keyName);
}

module.exports = (prompt, input) => {
  const [key, ...args] = input.split(" ");
  const keyNames = prompt.split(" ").slice(1);
  return keyNames.reduce(
    (acc, curVal, idx) => {
      const cleanKey = cleanKeyName(curVal);
      if (isRest(curVal)) {
        acc[cleanKey] = args.slice(idx);
      } else {
        acc[cleanKey] = args[idx];
      }
      if (isRequired(curVal) && typeof args[idx] === "undefined") {
        throw new Error(`Argument "${cleanKey}" is required`);
      }
      return acc;
    },
    { key }
  );
};
