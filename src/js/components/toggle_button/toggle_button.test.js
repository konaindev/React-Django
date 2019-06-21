import ToggleButton from "./index";
import renderer from "react-test-renderer";
import { props } from "./props";

describe("ToggleButton", () => {

  it("renders correctly", () => {
    const tree = renderer.create(<ToggleButton {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
