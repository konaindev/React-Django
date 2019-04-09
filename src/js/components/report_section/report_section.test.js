import renderer from "react-test-renderer";
import ReportSection from "./index";
import ReportDateSpan from "../report_date_span";

describe("ReportSection", () => {
  it("renders correctly", () => {
    const props = {
      name: "Test Name"
    };
    const tree = renderer.create(<ReportSection {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with report date span correctly", () => {
    const props = {
        name: "Test Name",
        sectionItems: (
          <ReportDateSpan
            name="Report Span"
            dates={{ start: "2018-01-01", end: "2018-02-01" }}
          />
        )
    };
    const tree = renderer.create(<ReportSection {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
