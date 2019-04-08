import renderer from "react-test-renderer";
import ReleaseNoteDetails from "./index";
import { props } from "./release_note_details.stories";

describe("ReleaseNoteDetails", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<ReleaseNoteDetails {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
