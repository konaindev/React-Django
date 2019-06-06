import renderer from "react-test-renderer";

import RegionalMap from "./index";
import { props } from "./props";

describe("RegionalMap", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<RegionalMap {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("max size", () => {
    const tree = renderer
      .create(<RegionalMap width="100%" height="100%" {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
