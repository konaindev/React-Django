import renderer from "react-test-renderer";

import KPICard from "./index";
import { offTrack, atRisk, onTrack } from "./props";

describe("SectionHeader", () => {
  it("renders Off Track", () => {
    const tree = renderer.create(<KPICard {...offTrack} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders At Risk", () => {
    const tree = renderer.create(<KPICard {...atRisk} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders On Track", () => {
    const tree = renderer.create(<KPICard {...onTrack} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
