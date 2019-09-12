import React from "react";
import renderer from "react-test-renderer";

import AccountSettings from "./index";

jest.mock("rc-tooltip");

describe("AccountSettings", () => {
  it("account security tab", () => {
    const tree = renderer
      .create(<AccountSettings initialTab="lock" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
