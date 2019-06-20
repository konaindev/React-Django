import renderer from "react-test-renderer";
import ModelingReportPage from "./index";
import { props as report } from "../modeling_view/props.js";
import { project, report_links } from "../project_page/props";

describe("ModelingReportPage", () => {
  it("renders correctly", () => {
    const current_report_link = report_links.modeling;
    const props = { project, report, report_links, current_report_link };
    const tree = renderer.create(<ModelingReportPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
