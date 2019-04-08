import CommonReport from "./index";
import renderer from "react-test-renderer";
import { BASELINE_REPORT, PERFORMANCE_REPORT } from "./common_report.stories";

describe("CommonReport", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  it("renders baseline report correctly", () => {
    const props = {
      report: BASELINE_REPORT,
      type: "baseline"
    };
    const tree = renderer.create(<CommonReport {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders performance report correctly", () => {
    const props = {
      report: PERFORMANCE_REPORT,
      type: "performance"
    };
    const tree = renderer.create(<CommonReport {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with date span correctly", () => {
    const props = {
      report: PERFORMANCE_REPORT,
      type: "performance",
      dateSpan: <div>"MY DATE SPAN GOES HERE"</div>
    };
    const tree = renderer.create(<CommonReport {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
