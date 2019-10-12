import renderer from "react-test-renderer";

import PortfolioTable from "./index";
import { props, withoutKPIs, partialKPIs } from "./props";

describe("PortfolioTable", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<PortfolioTable {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without KPIs", () => {
    const tree = renderer.create(<PortfolioTable {...withoutKPIs} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders partial KPIs", () => {
    const tree = renderer.create(<PortfolioTable {...partialKPIs} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
