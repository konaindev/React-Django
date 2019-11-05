import renderer from "react-test-renderer";

import PortfolioTable from "./index";
import { props, withoutKPIs, partialKPIs } from "./props";
import { BrowserRouter } from "react-router-dom";

describe("PortfolioTable", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<BrowserRouter><PortfolioTable {...props} /></BrowserRouter>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without KPIs", () => {
    const tree = renderer.create(<BrowserRouter><PortfolioTable {...withoutKPIs} /></BrowserRouter>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders partial KPIs", () => {
    const tree = renderer.create(<BrowserRouter><PortfolioTable {...partialKPIs} /></BrowserRouter>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
