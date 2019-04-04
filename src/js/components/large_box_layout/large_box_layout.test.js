import { LargeBoxLayout } from "./index";
import renderer from "react-test-renderer";

describe("LargeBoxLayout", () => {
  it("renders correctly", () => {
    const props = {
      name: "Test name",
      content: "Test content",
      detail: "This is details",
      detail2: "This is more details",
      innerBox: null
    };
    const tree = renderer.create(<LargeBoxLayout {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
