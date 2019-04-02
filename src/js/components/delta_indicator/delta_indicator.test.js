import DeltaIndicator from "./index";
import renderer from "react-test-renderer";

describe("DeltaIndicator", () => {
  it("renders left indicator correctly", () => {
    const props = {
      delta: 0.2,
      direction: 1,
      indicatorPos: "left"
    };
    const tree = renderer.create(<DeltaIndicator {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders right indicator correctly", () => {
    const props = {
      delta: -0.5,
      direction: -1,
      indicatorPos: "right"
    };
    const tree = renderer.create(<DeltaIndicator {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
