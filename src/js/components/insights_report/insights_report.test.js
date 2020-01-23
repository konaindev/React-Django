import React from "react";
import renderer from "react-test-renderer";

import InsightsReport from "./index";
import { props } from "./props";

describe("InsightsReport", () => {
  it("render default", () => {
    const tree = renderer.create(<InsightsReport {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render no_insights", () => {
    const tree = renderer.create(<InsightsReport />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
