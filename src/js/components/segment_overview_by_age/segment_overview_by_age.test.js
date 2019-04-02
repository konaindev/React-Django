import renderer from "react-test-renderer";
import SegmentOverviewByAge from "./index";
import { props } from "./segment_overview_by_age.stories";

describe("SegmentOverviewByAge", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SegmentOverviewByAge {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
