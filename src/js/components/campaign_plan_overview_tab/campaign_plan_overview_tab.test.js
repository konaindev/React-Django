import { shallow } from "enzyme";

import { CampaignPlanOverviewTab, CampaignOverviewSegments, CampaignOverviewObjectives } from "./index";
import CampaignPlanProps from "../campaign_plan/campaign_plan.props";

describe("CampaignPlanOverviewTab", () => {
  it("renders CampaignPlanOverviewTab correctly", () => {
    const tree = shallow(<CampaignPlanOverviewTab {...CampaignPlanProps.overview} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders CampaignOverviewSegments correctly", () => {
    const tree = shallow(<CampaignOverviewSegments segments={CampaignPlanProps.overview.target_segments} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders CampaignOverviewObjectives correctly", () => {
    const tree = shallow(<CampaignOverviewObjectives {...CampaignPlanProps.overview} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
