import renderer from "react-test-renderer";
import PerformanceReportPage from "./index";
import { props } from "./props";

describe("PerformanceReportPage", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  it("renders correctly", () => {
    const tree = renderer.create(<PerformanceReportPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
