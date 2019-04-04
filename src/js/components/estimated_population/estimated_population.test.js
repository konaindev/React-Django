import EstimatedPopulation from "./index";
import renderer from "react-test-renderer";
import { props_radius, props_zips } from "./estimated_population.stories";

describe("EstimatedPopulation", () => {
  it("renders circle with radius correctly", () => {
    const tree = renderer.create(<EstimatedPopulation {...props_radius} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders zip code polygons correctly", () => {
    const tree = renderer.create(<EstimatedPopulation {...props_zips} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
