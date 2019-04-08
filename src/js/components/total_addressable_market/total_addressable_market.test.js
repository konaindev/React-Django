import renderer from "react-test-renderer";
import TotalAddressableMarket from "./index";
import props from "./MarketAnalysis.js";

describe("TotalAddressableMarket", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<TotalAddressableMarket {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
