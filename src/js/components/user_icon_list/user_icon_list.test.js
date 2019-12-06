import React from "react";
import renderer from "react-test-renderer";

import UserIconList from "./index";
import { props } from "./props";

describe("UserIconList", () => {
  it("render default", () => {
    const tree = renderer.create(<UserIconList {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("render project theme", () => {
    const tree = renderer
      .create(<UserIconList theme="project" {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
