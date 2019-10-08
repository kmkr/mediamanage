function cleanKeyName(keyName) {
  const replace = [/^\[/, /\]$/, "..."];
  return replace.reduce(
    (keyName, curReplace) => keyName.replace(curReplace, ""),
    keyName
  );
}

function isRest(keyName) {
  return keyName.includes("...");
}

module.exports = (prompt, input) => {
  const [key, ...args] = input.split(" ");
  const keyNames = prompt.split(" ").slice(1);
  return keyNames.reduce(
    (acc, curVal, idx) => {
      const cleanKey = cleanKeyName(curVal);
      if (isRest(curVal)) {
        acc[cleanKey] = args.slice(idx).join(" ");
      } else {
        acc[cleanKey] = args[idx];
      }
      return acc;
    },
    { key }
  );
};
