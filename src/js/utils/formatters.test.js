import { formatDateWithTokens } from "./formatters";

describe('utils > formatters', () => {
  it("formatDateWithTokens()", () => {
    expect(formatDateWithTokens("2018-12-17", "MMM D, YYYY")).toEqual("Dec 17, 2018");
  });

  it("formatDateWithTokens with not date value", () => {
    expect(formatDateWithTokens("Bad date", "MMM D, YYYY")).toEqual("Bad date");
  });
});
