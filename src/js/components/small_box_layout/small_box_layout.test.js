import renderer from "react-test-renderer";
import { SmallBoxLayout } from "./index";

describe("SmallBoxLayout", () => {
  it("renders correctly", () => {
    const props = {
      name: "Test name",
      content: "Test content",
      detail: "This is details"
    };
    const tree = renderer.create(<SmallBoxLayout {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
