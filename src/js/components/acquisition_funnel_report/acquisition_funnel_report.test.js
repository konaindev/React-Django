import AcquisitionFunnelReport from "./index";
import renderer from "react-test-renderer";

import {
  BASELINE_REPORT,
  PERFORMANCE_REPORT
} from "./acquisition_funnel_report.stories";

describe("AcquisitionFunnelReport", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  it("renders baseline report correctly", () => {
    const props = {
      type: "baseline",
      report: BASELINE_REPORT
    };
    const tree = renderer
      .create(<AcquisitionFunnelReport {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders performance report correctly", () => {
    const props = {
      type: "performance",
      report: PERFORMANCE_REPORT
    };
    const tree = renderer
      .create(<AcquisitionFunnelReport {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
