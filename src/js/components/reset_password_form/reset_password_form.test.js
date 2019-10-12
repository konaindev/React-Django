import React from "react";
import renderer from "react-test-renderer";

import ResetPasswordForm from "./index";

describe("ResetPasswordForm", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<ResetPasswordForm></ResetPasswordForm>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
