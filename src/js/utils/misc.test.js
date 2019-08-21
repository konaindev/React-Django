import { qsParse, qsStringify } from "./misc";

describe.only("utils > query strings", () => {
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
