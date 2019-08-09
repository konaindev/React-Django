import MarketSizeMap from "./index";
import renderer from "react-test-renderer";
import{
  circleOnly,
  zipcodesOnly,
  circleWithZipcodes,
  polygonWithHole
} from "./props";

describe("MarketSizeMap", () => {
  it("renders circle-only mode correctly", () => {
    const tree = renderer
      .create(<MarketSizeMap {...circleOnly} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders zipcodes-only mode correctly", () => {
    const tree = renderer
      .create(<MarketSizeMap {...zipcodesOnly} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders circle-with-zipcodes mode correctly", () => {
    const tree = renderer
      .create(<MarketSizeMap {...circleWithZipcodes} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders polygon-with-hole map correctly", () => {
    const tree = renderer
      .create(<MarketSizeMap {...polygonWithHole} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
