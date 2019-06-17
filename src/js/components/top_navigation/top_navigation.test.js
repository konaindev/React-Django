import renderer from "react-test-renderer";

import TopNavigation from "./index";
import { props } from "./props";

describe("TopNavigation", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<TopNavigation {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
