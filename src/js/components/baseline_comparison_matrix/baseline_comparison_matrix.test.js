import BaselineComparisonMatrix from "./index";
import renderer from "react-test-renderer";
import { props, one_competitor_props, no_competitor_props } from "./props";

describe("BaselineComparisonMatrix", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<BaselineComparisonMatrix {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("One Competitor", () => {
    const tree = renderer
      .create(<BaselineComparisonMatrix {...one_competitor_props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("No Competitors", () => {
    const tree = renderer
      .create(<BaselineComparisonMatrix {...no_competitor_props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
