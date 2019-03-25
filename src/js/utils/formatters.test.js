import { formatDateWithTokens } from "./formatters";

describe('utils > formatters', () => {
  it("formatDateWithTokens()", () => {
    expect(formatDateWithTokens("2018-12-17", "MMM D, YYYY")).toEqual("Dec 17, 2018");
  });
});
