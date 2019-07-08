import renderer from "react-test-renderer";

import { props as user } from "../user_menu/props";
import ProjectPageChrome from "./index";

describe("ProjectPageChrome", () => {
  it("renders correctly", () => {
    const props = {
      user: user,
      topItems: <div>topItems</div>,
      children: <div>children</div>
    };

    const tree = renderer.create(<ProjectPageChrome {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
