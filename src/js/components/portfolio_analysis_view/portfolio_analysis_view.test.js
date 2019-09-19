import renderer from "react-test-renderer";

import { PortfolioAnalysisView } from "./index";
import { props, withoutKPIs, partialKPIs } from "./props";

describe("PortfolioAnalysisView", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<PortfolioAnalysisView {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without KPIs", () => {
    const tree = renderer
      .create(<PortfolioAnalysisView {...withoutKPIs} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders partial KPIs", () => {
    const tree = renderer
      .create(<PortfolioAnalysisView {...partialKPIs} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
