import React from "react";
import renderer from "react-test-renderer";

import ResetPasswordDone from "./index";

describe("ResetPasswordDone", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<ResetPasswordDone></ResetPasswordDone>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
