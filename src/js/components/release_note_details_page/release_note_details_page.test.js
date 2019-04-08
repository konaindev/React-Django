import renderer from "react-test-renderer";
import ReleaseNoteDetailsPage from "./index";
import { props } from "./release_note_details_page.stories";

describe("ReleaseNoteDetailsPage", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<ReleaseNoteDetailsPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
