import renderer from "react-test-renderer";

import USSubRegionMap from "./index";
import { west, midwest, south, northEast } from "./props";

describe("USSubRegionMap", () => {
  it("renders West", () => {
    const tree = renderer.create(<USSubRegionMap {...west} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders Midwest", () => {
    const tree = renderer.create(<USSubRegionMap {...midwest} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders South", () => {
    const tree = renderer.create(<USSubRegionMap {...south} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders North East", () => {
    const tree = renderer.create(<USSubRegionMap {...northEast} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
