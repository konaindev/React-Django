import renderer from "react-test-renderer";

import CampaignPlan from "./index";
import CampaignPlanProps from "./campaign_plan.props";

describe("CampaignPlan", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<CampaignPlan {...CampaignPlanProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
