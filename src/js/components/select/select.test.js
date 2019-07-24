import React from "react";
import renderer from "react-test-renderer";

import Select, { SelectSearch } from "./index";
import { props } from "./props";

describe("Select", () => {
  it("render select", () => {
    const tree = renderer.create(<Select {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render highlight select", () => {
    const tree = renderer
      .create(<Select theme="highlight" {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render select search", () => {
    const tree = renderer.create(<SelectSearch {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render highlight select search", () => {
    const tree = renderer
      .create(<SelectSearch theme="highlight" {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
