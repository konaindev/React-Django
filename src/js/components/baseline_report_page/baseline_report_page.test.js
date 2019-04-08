import BaselineReportPage from "./index";
import renderer from "react-test-renderer";
import { project, report_links } from "../project_page/project_page.stories.js";
import { report } from "./baseline_report_page.stories";

describe("BaselineReportPage", () => {
  it("renders correctly", () => {
    const current_report_link = report_links.baseline;
    const props = { project, report, report_links, current_report_link };
    const tree = renderer
      .create(<BaselineReportPage {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
