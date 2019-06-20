import MarketReportPage from "./index";
import renderer from "react-test-renderer";
import report from "../total_addressable_market/MarketAnalysis.js";
import { project, report_links } from "../project_page/props";

describe("MarketReportPage", () => {
  it("renders correctly", () => {
    const current_report_link = report_links.market;
    const props = { project, report, report_links, current_report_link };
    const tree = renderer.create(<MarketReportPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
