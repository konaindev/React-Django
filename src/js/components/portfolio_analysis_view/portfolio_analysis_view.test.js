import { shallow } from "enzyme";

import { PortfolioAnalysisView } from "./index";
import { props, withoutKPIs, partialKPIs } from "./props";

describe("PortfolioAnalysisView", () => {
  it("renders correctly", () => {
    const tree = shallow(<PortfolioAnalysisView {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it("renders without KPIs", () => {
    const tree = shallow(<PortfolioAnalysisView {...withoutKPIs} />);
    expect(tree).toMatchSnapshot();
  });
  it("renders partial KPIs", () => {
    const tree = shallow(<PortfolioAnalysisView {...partialKPIs} />);
    expect(tree).toMatchSnapshot();
  });
});
