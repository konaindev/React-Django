import renderer from "react-test-renderer";
import ReleaseNotesPage from "./index";
import { props } from "./release_notes_page.stories";

describe("ReleaseNotesPage", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<ReleaseNotesPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
