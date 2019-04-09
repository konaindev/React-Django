import renderer from "react-test-renderer";
import ReleaseNotesTable from "./index";
import { props } from "./release_notes_table.stories";

describe("ReleaseNotesTable", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<ReleaseNotesTable {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
