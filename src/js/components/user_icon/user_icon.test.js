import React from "react";
import renderer from "react-test-renderer";

import UserIcon from "./index";
import { props } from "./props";

describe("UserIcon", () => {
  it("render default", () => {
    const tree = renderer.create(<UserIcon {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render without avatar", () => {
    const tree = renderer
      .create(<UserIcon {...props} profile_image_url="" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
