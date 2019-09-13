import React from "react";
import renderer from "react-test-renderer";

import AccountSettings from "./index";
import { props } from "./props";

jest.mock("rc-tooltip");

describe("AccountSettings", () => {
  it("account security tab", () => {
    const tree = renderer
      .create(<AccountSettings initialTab="lock" {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("profile tab", () => {
    const tree = renderer
      .create(<AccountSettings initialTab="profile" {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
