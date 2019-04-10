import renderer from "react-test-renderer";

import CampaignPlanGenericTab from "./index";
import CampaignPlanProps from "../campaign_plan/campaign_plan.props";

describe("CampaignPlanOverviewTab", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <CampaignPlanGenericTab
          {...CampaignPlanProps["demand_creation"]}
          tabKey="demand_creation"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
