import React from "react";
import renderer from "react-test-renderer";

import Loader from "./index";

describe("Loader", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Loader isVisible={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("hidden", () => {
    const tree = renderer.create(<Loader isVisible={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
