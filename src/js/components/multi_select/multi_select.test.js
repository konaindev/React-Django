import React from "react";
import renderer from "react-test-renderer";

import Select from "./index";
import { props } from "./props";

describe("Select", () => {
  it("render select", () => {
    const tree = renderer.create(<Select {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("all selected", () => {
    const tree = renderer
      .create(<Select {...props} selectAllLabel="ALL" value={props.options} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
