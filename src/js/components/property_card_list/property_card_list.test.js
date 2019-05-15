import renderer from "react-test-renderer";
import PropertyCardList from "./index";
import { props } from "./props";

describe("PropertyCardList", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<PropertyCardList {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
