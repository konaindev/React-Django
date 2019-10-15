import renderer from "react-test-renderer";
import PerformanceReportSpanDropdown from "./index";
import { props } from "./props";

describe("PerformanceReportSpanDropdown", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<PerformanceReportSpanDropdown {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
