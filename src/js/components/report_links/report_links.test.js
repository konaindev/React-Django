import renderer from "react-test-renderer";
import ReportLinks from "./index";
import { props } from "./report_links.stories";
import { report_link_all, report_link_no_campaign_market } from "./props";

const current_report_name = "baseline";

describe("ReportLinks", () => {
  it("renders correctly", () => {
    const report_links = report_link_all;
    const tree = renderer
      .create(<ReportLinks {...{ current_report_name, report_links }} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
