import renderer from "react-test-renderer";
import React from "react";

import ButtonLabel from "./index";

describe("ButtonLabel", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<ButtonLabel label="beta">insights</ButtonLabel>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
