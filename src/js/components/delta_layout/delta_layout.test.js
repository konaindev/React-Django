import DeltaLayout from "./index";
import renderer from "react-test-renderer";

describe("DeltaLayout", () => {
  it("renders correctly", () => {
    const props = {
      valueContent: 50,
      delta: 2,
      direction: DeltaLayout.DIRECTION_UP
    };
    const tree = renderer.create(<DeltaLayout {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
