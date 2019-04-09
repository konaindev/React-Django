import MarketSizeGrowthReach from "./index";
import renderer from "react-test-renderer";
import { props_radius, props_zips } from "./market_size_map.stories";

describe("MarketSizeGrowthReach", () => {
  it("renders circle with radius correctly", () => {
    const tree = renderer
      .create(<MarketSizeGrowthReach {...props_radius} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders zip code polygons correctly", () => {
    const tree = renderer
      .create(<MarketSizeGrowthReach {...props_zips} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
