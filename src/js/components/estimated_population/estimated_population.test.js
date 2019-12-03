import { shallow } from "enzyme";

import EstimatedPopulation, { InfoBox } from "./index";
import { props_radius, props_zips } from "./props";

describe("EstimatedPopulation", () => {
  it("renders circle with radius correctly - Wrapper", () => {
    const tree = shallow(<EstimatedPopulation {...props_radius} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders circle with radius correctly - InfoBox", () => {
    const tree = shallow(<InfoBox {...props_radius} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders zip code polygons correctly - Wrapper", () => {
    const tree = shallow(<EstimatedPopulation {...props_zips} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders zip code polygons correctly - InfoBox", () => {
    const tree = shallow(<InfoBox {...props_zips} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
