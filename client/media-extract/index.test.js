const mediaExtract = require("./index");

test("validate", () => {
  const arg = {
    from: 0,
    to: 1,
    toAndPerformerNamesAndCategories: ["ole.brumm"]
  };
  expect(mediaExtract.validate(arg)).toBe(true);
});

test("support for string input", () => {
  const arg = {
    from: "1.2.3",
    to: "1.2.4",
    toAndPerformerNamesAndCategories: ["ole.brumm"]
  };
  expect(mediaExtract.validate(arg)).toBe(true);
});

test("invalid when from is before to", () => {
  const arg = {
    from: 1,
    to: 0,
    toAndPerformerNamesAndCategories: ["ole.brumm"]
  };
  expect(mediaExtract.validate(arg)).toBe(false);
});

test("invalid when from is before to with strings", () => {
  const arg = {
    from: "1.2.3",
    to: "1.2.2",
    toAndPerformerNamesAndCategories: ["ole.brumm"]
  };
  expect(mediaExtract.validate(arg)).toBe(false);
});
