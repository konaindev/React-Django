import React from "react";
import renderer from "react-test-renderer";

import MultiSelect from "./index";
import { props } from "./props";

describe("MultiSelect", () => {
  it("render select", () => {
    const tree = renderer.create(<MultiSelect {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("all selected", () => {
    const tree = renderer
      .create(
        <MultiSelect {...props} selectAllLabel="ALL" value={props.options} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
