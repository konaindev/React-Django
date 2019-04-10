import renderer from "react-test-renderer";

import CampaignPlanPage from "./index";
import CampaignPlanProps from "../campaign_plan/campaign_plan.props";
import { project, report_links } from "../project_page/project_page.stories.js";

describe("CampaignPlanPage", () => {
  it("renders correctly", () => {
    const current_report_link = report_links.market;
    const report = CampaignPlanProps;
    const props = { project, report, report_links, current_report_link };
    const tree = renderer.create(<CampaignPlanPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
