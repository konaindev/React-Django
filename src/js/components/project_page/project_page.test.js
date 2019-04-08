import renderer from "react-test-renderer";
import ProjectPage from "./index";
import { project, report_links } from "./project_page.stories";

describe("ProjectPage", () => {
  it("renders correctly", () => {
    const props = { project, report_links };

    const tree = renderer.create(<ProjectPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
