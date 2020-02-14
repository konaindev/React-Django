import { isNotBlankValues, qsParse, qsStringify, stripURL } from "./misc";

describe("utils > query strings", () => {
  it("qsParse()", () => {
    expect(qsParse("a=1&b=2", false)).toEqual({ a: "1", b: "2" });
    expect(qsParse("?a=1&b=2")).toEqual({ a: "1", b: "2" });
    expect(qsParse("a=1&a=2&b=3", false)).toEqual({ a: ["1", "2"], b: "3" });
    expect(qsParse("?a=1&a=2&b=3")).toEqual({ a: ["1", "2"], b: "3" });
  });

  it("qsStringify()", () => {
    let queryParams = { a: 1, b: 2 };
    expect(qsStringify(queryParams)).toBe("?a=1&b=2");
    expect(qsStringify(queryParams, false)).toBe("a=1&b=2");
    queryParams = { a: [1, 2], b: 3 };
    expect(qsStringify(queryParams)).toBe("?a=1&a=2&b=3");
    expect(qsStringify(queryParams, false)).toBe("a=1&a=2&b=3");
  });
});

describe("strip URL protocol", () => {
  it("stripURL", () => {
    expect(stripURL("http://test.com")).toBe("test.com");
    expect(stripURL("https://test.com")).toBe("test.com");
    expect(stripURL("http://www.test.com")).toBe("test.com");
    expect(stripURL("ftp://test.com")).toBe("test.com");
    expect(stripURL("ftp://www.test.com")).toBe("test.com");
    expect(stripURL("http://test.com/")).toBe("test.com");
    expect(stripURL("http://test.com/test")).toBe("test.com/test");
  });
});

describe("is not blank values in object", () => {
  it("isNotBlankValues", () => {
    expect(isNotBlankValues({ a: 1, b: 2 })).toBe(true);
    expect(isNotBlankValues({ a: "1", b: "2" })).toBe(true);
    expect(isNotBlankValues({ a: "1", b: "" })).toBe(false);
    expect(isNotBlankValues({ a: "1", b: 0 })).toBe(true);
    expect(isNotBlankValues({ a: "1", b: null })).toBe(false);
    expect(isNotBlankValues({ a: false })).toBe(true);
    expect(isNotBlankValues({})).toBe(false);
  });
});
