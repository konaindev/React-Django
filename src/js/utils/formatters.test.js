import { formatDateWithTokens, formatPhone } from "./formatters";

describe("utils > formatters", () => {
  it("formatDateWithTokens()", () => {
    expect(formatDateWithTokens("2018-12-17", "MMM D, YYYY")).toEqual("Dec 17, 2018");
  });

  it("formatDateWithTokens with not date value", () => {
    expect(formatDateWithTokens("Bad date", "MMM D, YYYY")).toEqual("Bad date");
  });

  it("formatPhone", () => {
    expect(formatPhone("1234567890")).toEqual("(123) 456-7890");
  });

  it("formatPhone with number input", () => {
    expect(formatPhone(1234567890)).toEqual("(123) 456-7890");
  });

  it("formatPhone with wrong input", () => {
    expect(formatPhone("test abc")).toEqual("");
  });

  it("formatPhone with careless input", () => {
    expect(formatPhone("123 45 abc 67  89x0000")).toEqual("(123) 456-7890");
  });
});
