import renderer from "react-test-renderer";

import DashboardControls from "./index";
import { props } from "./props";

describe("DashboardControls", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<DashboardControls {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
