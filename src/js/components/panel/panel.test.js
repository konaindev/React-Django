import renderer from "react-test-renderer";
import Panel from "./index";

describe("Panel", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Panel>Any panel content</Panel>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
