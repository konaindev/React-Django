import React from "react";
import renderer from "react-test-renderer";

import GroupSelect from "./index";
import { props } from "./props";

describe("GroupSelect", () => {
  it("render default", () => {
    const tree = renderer.create(<GroupSelect {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("all selected", () => {
    const tree = renderer
      .create(<GroupSelect {...props} menuIsOpen value={props.options} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
