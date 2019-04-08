import renderer from "react-test-renderer";
import PopulationChart from "./index";

describe("PopulationChart", () => {
  it("renders correctly", () => {
    const props = {
      segment_population: 10368,
      group_population: 3188
    };

    const tree = renderer.create(<PopulationChart {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
