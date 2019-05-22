import renderer from "react-test-renderer";

import BaselineReportPage from "./index";
import { props, one_competitor_props, no_competitors_props } from "./props";

describe("BaselineReportPage", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<BaselineReportPage {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("One Competitor", () => {
    const tree = renderer
      .create(<BaselineReportPage {...one_competitor_props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("No Competitors", () => {
    const tree = renderer
      .create(<BaselineReportPage {...no_competitors_props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
