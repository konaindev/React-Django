import React from "react";
import { MemoryRouter } from "react-router-dom";
import renderer from "react-test-renderer";

import ResetPasswordForm from "./index";

describe("ResetPasswordForm", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<MemoryRouter><ResetPasswordForm></ResetPasswordForm></MemoryRouter>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
