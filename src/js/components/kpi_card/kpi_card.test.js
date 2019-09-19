import renderer from "react-test-renderer";

import KPICard, { NoTargetKPICard, NoValueKPICard } from "./index";
import { offTrack, atRisk, onTrack, NoTargetCard, NoValueCard } from "./props";

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
  it("renders NoTargetKPICard", () => {
    const tree = renderer
      .create(<NoTargetKPICard {...NoTargetCard} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders NoValueKPICard", () => {
    const tree = renderer.create(<NoValueKPICard {...NoValueCard} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
