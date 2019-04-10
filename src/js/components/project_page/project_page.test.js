import renderer from "react-test-renderer";
import ProjectPage from "./index";
import { props } from "./props";

describe("ProjectPage", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<ProjectPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
