import LeasingPerformanceReport from "./index";
import renderer from "react-test-renderer";
import { BASELINE_REPORT, PERFORMANCE_REPORT } from "./leasing_performance_report.stories";

describe("LeasingPerformanceReport", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  it("renders baseline report correctly", () => {
    const props = {
      report: BASELINE_REPORT
    };
    const tree = renderer.create(<LeasingPerformanceReport {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders performance report correctly", () => {
    const props = {
      report: PERFORMANCE_REPORT
    };
    const tree = renderer.create(<LeasingPerformanceReport {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with section items correctly", () => {
    const props = {
      report: PERFORMANCE_REPORT,
      sectionItems: <div>"I AM SECTION ITEMS"</div>
    };
    const tree = renderer.create(<LeasingPerformanceReport {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
