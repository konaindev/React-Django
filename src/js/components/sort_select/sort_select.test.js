import React from "react";
import renderer from "react-test-renderer";

import SortSelect from "./index";
import { props } from "./props";

describe("SortSelect", () => {
  it("render sort select", () => {
    const tree = renderer.create(<SortSelect {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render reverse sort select", () => {
    const tree = renderer
      .create(<SortSelect {...props} direction="desc" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
