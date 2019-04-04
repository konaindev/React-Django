import renderer from "react-test-renderer";
import PageFooter from "./index";

describe("PageFooter", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<PageFooter />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
