import React from "react";
import renderer from "react-test-renderer";

import Checkbox from "./index";

describe("Checkbox", () => {
  it("render default", () => {
    const tree = renderer.create(<Checkbox />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("selected", () => {
    const tree = renderer
      .create(<Checkbox isSelected={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
