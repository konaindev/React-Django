import React from "react";
import renderer from "react-test-renderer";

import GoogleAddress from "./index";

describe("GoogleAddress", () => {
  it("render correctly", () => {
    const tree = renderer
      .create(<GoogleAddress loadOptions={() => {}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
