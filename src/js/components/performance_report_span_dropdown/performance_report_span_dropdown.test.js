import renderer from "react-test-renderer";
import PerformanceReportSpanDropdown from "./index";
import { props } from "./performance_report_span_dropdown.stories";

describe("PerformanceReportSpanDropdown", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<PerformanceReportSpanDropdown {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
