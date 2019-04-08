import MarketSegmentPieChart from "./index";
import renderer from "react-test-renderer";

describe("MarketSegmentPieChart", () => {
  it("renders correctly", () => {
    const props = {
      market_size: 30340,
      total_population: 120448,
      segments: [
        { label: "18-24", value: 0.09 },
        { label: "25-34", value: 0.11 },
        { label: "35-44", value: 0.3 },
        { label: "45-54", value: 0.15 },
        { label: "55-64", value: 0.1 },
        { label: "65+", value: 0.25 }
      ]
    };
    const tree = renderer.create(<MarketSegmentPieChart {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
