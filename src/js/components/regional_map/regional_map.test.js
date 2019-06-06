import renderer from "react-test-renderer";
import RegionalMap from "./index";

describe("RegionalMap", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<RegionalMap />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("max size", () => {
    const tree = renderer
      .create(<RegionalMap width="100%" height="100%" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
