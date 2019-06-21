import React from "react";
import renderer from "react-test-renderer";

import Input from "./index";

describe("Input", () => {
  it("render text input", () => {
    const tree = renderer.create(<Input type="text" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
