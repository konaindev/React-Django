import renderer from "react-test-renderer";

import CampaignPlanOverviewTab from "./index";
import CampaignPlanProps from "../campaign_plan/campaign_plan.props";

describe("CampaignPlanOverviewTab", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<CampaignPlanOverviewTab {...CampaignPlanProps.overview} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
