import { shallow } from "enzyme";

import PortfolioTable from "./index";
import { props, withoutKPIs, partialKPIs } from "./props";

describe("PortfolioTable", () => {
  it("renders correctly", () => {
    const tree = shallow(<PortfolioTable {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it("renders without KPIs", () => {
    const tree = shallow(<PortfolioTable {...withoutKPIs} />);
    expect(tree).toMatchSnapshot();
  });
  it("renders partial KPIs", () => {
    const tree = shallow(<PortfolioTable {...partialKPIs} />);
    expect(tree).toMatchSnapshot();
  });
});
