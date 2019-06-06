import renderer from "react-test-renderer";

import USRegionalMap from "./index";
import { props } from "./props";

describe("USRegionalMap", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<USRegionalMap {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("max size", () => {
    const tree = renderer
      .create(<USRegionalMap width="100%" height="100%" {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
