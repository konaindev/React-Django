import renderer from "react-test-renderer";

import { project, report_links } from "../project_page/props";
import CampaignPlanPage from "./index";
import campaignPlanProps from "../campaign_plan/campaign_plan.props";

describe("CampaignPlanPage", () => {
  it("renders correctly", () => {
    const current_report_link = report_links.market;
    const report = campaignPlanProps;
    const props = { project, report, report_links, current_report_link };
    const tree = renderer.create(<CampaignPlanPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
