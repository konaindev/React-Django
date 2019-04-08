import renderer from "react-test-renderer";
import ProjectPageChrome from "./index";

describe("ProjectPageChrome", () => {
  it("renders correctly", () => {
    const project = { name: "Portland Multi Family", public_id: "pro_example" };

    const props = {
      project: project,
      topItems: <div>topItems</div>,
      children: <div>children</div>
    };

    const tree = renderer.create(<ProjectPageChrome {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
