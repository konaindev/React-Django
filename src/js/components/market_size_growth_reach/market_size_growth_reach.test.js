import MarketSizeGrowthReach from "./index";
import renderer from "react-test-renderer";
import { props } from "./market_size_growth_reach.stories";

describe("MarketSizeGrowthReach", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<MarketSizeGrowthReach {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
