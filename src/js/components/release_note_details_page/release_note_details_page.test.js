import { shallow } from "enzyme";
import ReleaseNoteDetailsPage from "./index";
import { props } from "./release_note_details_page.stories";


describe("ReleaseNoteDetailsPage", () => {
  it("renders correctly", () => {
    const tree = shallow(<ReleaseNoteDetailsPage {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
