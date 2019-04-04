import AgeRangePopulationSize from "./index";
import renderer from "react-test-renderer";

describe("AgeRangePopulationSize", () => {
  it("renders correctly", () => {
    const props = {
      age_group: "18-24",
      color: "#41C100",
      market_size: 2794,
      segment_population: 10369
    };
    const tree = renderer
      .create(<AgeRangePopulationSize {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
