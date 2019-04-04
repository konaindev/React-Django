import MarketSizeByIncome from "./index";
import renderer from "react-test-renderer";

describe("MarketSizeByIncome", () => {
  it("renders correctly", () => {
  const props = {
    income: "75000.00",
    segment_population: 10368,
    group_population: 3188,
    home_owners: {
      total: 249,
      family: 123,
      nonfamily: 126
    },
    renters: {
      total: 2940,
      family: 459,
      nonfamily: 2481
    },
    market_size: 2481,
    active_populations: ["renters.nonfamily"]
  };

    const tree = renderer.create(<MarketSizeByIncome {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
