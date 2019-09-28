import renderer from "react-test-renderer";

import InvestmentAllocation from "./index";
import { props, propsFill } from "./props";
import PerformanceReportProps from "../performance_report_page/props";

describe("SectionHeader", () => {
  it("renders empty pie", () => {
    const tree = renderer
      .create(
        <InvestmentAllocation
          {...props}
          report={PerformanceReportProps.report}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders 100% pie", () => {
    const tree = renderer
      .create(
        <InvestmentAllocation
          {...propsFill}
          report={PerformanceReportProps.report}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
