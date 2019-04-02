import renderer from "react-test-renderer";
import ReportDateSpan from "./index";

describe("ReportDateSpan", () => {
  it("renders correctly", () => {
    const props = {
      name: "Report Span",
      dates: {
        start: "2018-01-01",
        end: "2018-02-01"
      }
    };
    const tree = renderer.create(<ReportDateSpan {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
