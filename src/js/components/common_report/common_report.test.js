import { shallow } from "enzyme";

import CommonReport from "./index";
import { propsForBaselineReport } from "./props";

const propsForBaselineReportWithoutCompetitors = {
  ...propsForBaselineReport,
  report: { ...propsForBaselineReport.report, competitors: [] }
};

describe("CommonReport", () => {
  it("renders baseline report with competitors correctly", () => {
    const tree = shallow(<CommonReport {...propsForBaselineReport} />);
    expect(tree.debug({ ignoreProps: true })).toMatchSnapshot();
  });

  it("renders baseline report without competitor correctly", () => {
    const tree = shallow(
      <CommonReport {...propsForBaselineReportWithoutCompetitors} />
    );
    expect(tree.debug({ ignoreProps: true })).toMatchSnapshot();
  });
});
