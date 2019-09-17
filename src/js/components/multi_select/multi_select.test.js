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
        <MultiSelect
          {...props}
          menuIsOpen
          selectAllLabel="ALL"
          value={props.options}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("highlight", () => {
    const tree = renderer
      .create(
        <MultiSelect
          {...props}
          menuIsOpen
          isShowControls={false}
          isShowAllOption={false}
          theme="highlight"
          value={props.options}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("gray", () => {
    const tree = renderer
      .create(
        <MultiSelect
          {...props}
          menuIsOpen
          isShowControls={false}
          isShowAllOption={false}
          theme="gray"
          value={props.options}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
