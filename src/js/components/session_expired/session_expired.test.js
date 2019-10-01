import React from "react";
import renderer from "react-test-renderer";

import SessionExpired from "./index";

describe("SessionExpired", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SessionExpired />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
