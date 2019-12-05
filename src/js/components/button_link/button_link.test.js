import React from "react";
import renderer from "react-test-renderer";

import ButtonLink from "./index";

describe("ButtonLink", () => {
  it("renders link correctly", () => {
    const tree = renderer
      .create(<ButtonLink link="http://www.test.com/" target="_blank" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
