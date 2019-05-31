import React from "react";
import renderer from "react-test-renderer";

import AddPropertyForm from "./index";
import { props } from "./props";

describe("AddPropertyForm", () => {
  it("add property form", () => {
    const tree = renderer.create(<AddPropertyForm {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
