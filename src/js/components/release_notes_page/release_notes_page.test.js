import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import ReleaseNotesPage from "./index";
import { props } from "./release_notes_page.stories";

describe("ReleaseNotesPage", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <ReleaseNotesPage {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
