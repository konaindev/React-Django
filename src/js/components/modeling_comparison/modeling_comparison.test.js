import ModelingComparison from "./index";
import renderer from "react-test-renderer";
import props from "./ModelingOptions";

describe("ModelingComparison", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<ModelingComparison {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
