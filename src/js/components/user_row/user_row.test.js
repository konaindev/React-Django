import React from "react";
import renderer from "react-test-renderer";

import UserRow from "./index";
import { props } from "./props";

describe("UserRow", () => {
  it("render default", () => {
    const tree = renderer.create(<UserRow {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render without avatar", () => {
    const tree = renderer
      .create(<UserRow {...props} profile_image_url="" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
