import { shallow } from "enzyme";

import KPICard, { NoTargetKPICard, NoValueKPICard } from "./index";
import { offTrack, atRisk, onTrack, NoTargetCard, NoValueCard } from "./props";

describe("KPICard", () => {
  it("renders Off Track", () => {
    const tree = shallow(<KPICard {...offTrack} />);
    expect(tree).toMatchSnapshot();
  });
  it("renders At Risk", () => {
    const tree = shallow(<KPICard {...atRisk} />);
    expect(tree).toMatchSnapshot();
  });
  it("renders On Track", () => {
    const tree = shallow(<KPICard {...onTrack} />);
    expect(tree).toMatchSnapshot();
  });
  it("renders NoTargetKPICard", () => {
    const tree = shallow(<NoTargetKPICard {...NoTargetCard} />);
    expect(tree).toMatchSnapshot();
  });
  it("renders NoValueKPICard", () => {
    const tree = shallow(<NoValueKPICard {...NoValueCard} />);
    expect(tree).toMatchSnapshot();
  });
});
