import React from "react";
import renderer from "react-test-renderer";

import UserMenu from "./index";
import { props } from "./props";

describe("UserMenu", () => {
  it("render default", () => {
    const tree = renderer.create(<UserMenu {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render opened", () => {
    const tree = renderer.create(<UserMenu {...props} menuIsOpen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
