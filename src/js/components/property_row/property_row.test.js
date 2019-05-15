import renderer from "react-test-renderer";
import PropertyRow from "./index";
import { props } from "./props";

describe("PropertyRow", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<PropertyRow {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
