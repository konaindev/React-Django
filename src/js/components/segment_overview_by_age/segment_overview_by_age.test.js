import { shallow } from "enzyme";

import SegmentOverviewByAge from "./index";
import { props } from "./segment_overview_by_age.stories";

describe("SegmentOverviewByAge", () => {
  it("renders correctly", () => {
    const tree = shallow(<SegmentOverviewByAge {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
