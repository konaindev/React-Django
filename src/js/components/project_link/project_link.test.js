import renderer from "react-test-renderer";

import ProjectLink from "./index";
import { props } from "./props";

describe("ProjectLink", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<ProjectLink {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
