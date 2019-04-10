import renderer from "react-test-renderer";
import ModelingView from "./index";
import { props } from "./props";

describe("ModelingView", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<ModelingView {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
