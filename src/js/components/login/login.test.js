import React from "react";
import renderer from "react-test-renderer";

import LoginView from "./index";

describe("LoginView", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<LoginView></LoginView>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
