import renderer from "react-test-renderer";
import ReportLinks from "./index";
import { props } from "./report_links.stories";
import { report_link_all, report_link_no_campaign_market } from "./props";

const currentReportType = "baseline";

describe("ReportLinks", () => {
  it("renders correctly", () => {
    const reportLinks = report_link_all;
    const tree = renderer
      .create(<ReportLinks {...{ currentReportType, reportLinks }} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
