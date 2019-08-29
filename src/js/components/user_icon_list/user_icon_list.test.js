import React from "react";
import renderer from "react-test-renderer";

import UserIconList from "./index";
import { props } from "./props";

describe("UserIconList", () => {
  it("render default", () => {
    const tree = renderer.create(<UserIconList {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
