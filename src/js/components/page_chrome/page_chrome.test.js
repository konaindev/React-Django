import renderer from "react-test-renderer";
import PageChrome from "./index";

describe("PageChrome", () => {
  it("renders correctly", () => {
    const props = {
      headerItems: <div>headerItems</div>,
      topItems: <div>topItems</div>,
      children: <div>children</div>
    };

    const tree = renderer.create(<PageChrome {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
