import renderer from "react-test-renderer";
import CampaignPlanOverviewTab from "./index";
import props from "./campaign_plan_overview_tab.props";

describe("CampaignPlanOverviewTab", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<CampaignPlanOverviewTab {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
