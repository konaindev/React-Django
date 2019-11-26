import { shallow } from "enzyme";

import RentToIncomeAnalysis from "./index";
import { props_large, props_small } from "./props";

describe("RentToIncomeAnalysis", () => {
  it("renders in small mode correctly", () => {
    const tree = shallow(<RentToIncomeAnalysis {...props_small} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders in large mode correctly", () => {
    const tree = shallow(<RentToIncomeAnalysis {...props_large} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
