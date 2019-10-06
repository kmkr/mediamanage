const { unique, flatten } = require("./array-helper");

test("array unique", () => {
  const strings = ["foo", "bar", "foo", "bar", "bar"];
  expect(strings.sort().filter(unique)).toEqual(["bar", "foo"]);
});

test("array flatten", () => {
  const ary = [[1, 2], ["foo", "bar"], "waz"];
  expect(ary.reduce(flatten, [])).toEqual([1, 2, "foo", "bar", "waz"]);
});
