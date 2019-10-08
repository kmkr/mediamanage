const parser = require("./parser");

test("parse with key", () => {
  const prompt = "a";
  const input = "a";
  expect(parser(prompt, input)).toEqual({ key: "a" });
});

test("parse with single argument", () => {
  const prompt = "a [start]";
  const input = "a 10";
  expect(parser(prompt, input)).toEqual({ key: "a", start: "10" });
});

test("parse with multi arguments", () => {
  const prompt = "a [start] [end]";
  const input = "a 20 30";
  expect(parser(prompt, input)).toEqual({ key: "a", start: "20", end: "30" });
});

test("parse with rest arguments", () => {
  const prompt = "a [start] [...allthestuff]";
  const input = "a 20 hey man whats up";
  expect(parser(prompt, input)).toEqual({
    key: "a",
    start: "20",
    allthestuff: "hey man whats up"
  });
});
