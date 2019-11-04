import renderer from "react-test-renderer";

import { PortfolioAnalysisView } from "./index";
import { props, withoutKPIs, partialKPIs } from "./props";
import { BrowserRouter } from "react-router-dom";

describe("PortfolioAnalysisView", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <PortfolioAnalysisView {...props} />
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without KPIs", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <PortfolioAnalysisView {...withoutKPIs} />
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders partial KPIs", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <PortfolioAnalysisView {...partialKPIs} />
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
