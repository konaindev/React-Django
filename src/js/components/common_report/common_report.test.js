import CommonReport from "./index";
import renderer from "react-test-renderer";
import { propsForBaselineReport, propsForPeformanceReport, propsForPeformanceReportWithDateSpan } from "./props";

const propsForBaselineReportWithoutCompetitors = { ...propsForBaselineReport, competitors: [] };

describe("CommonReport", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  it("renders baseline report with competitors correctly", () => {
    const tree = renderer.create(<CommonReport {...propsForBaselineReport} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders baseline report without competitor correctly", () => {
    const tree = renderer.create(<CommonReport {...propsForBaselineReportWithoutCompetitors} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders performance report correctly", () => {
    const tree = renderer
      .create(<CommonReport {...propsForPeformanceReport} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with date span correctly", () => {
    const tree = renderer
      .create(<CommonReport {...propsForPeformanceReportWithDateSpan} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
