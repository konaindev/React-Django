import React from "react";
import renderer from "react-test-renderer";

import UsersIcon from "./index";
import { props } from "./props";

describe("UsersIcon", () => {
  it("render default", () => {
    const tree = renderer.create(<UsersIcon {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
