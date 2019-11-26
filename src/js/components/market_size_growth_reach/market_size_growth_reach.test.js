import { shallow } from "enzyme";

import MarketSizeGrowthReach from "./index";
import { props } from "./market_size_growth_reach.stories";

describe("MarketSizeGrowthReach", () => {
  it("renders correctly", () => {
    const tree = shallow(<MarketSizeGrowthReach {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
