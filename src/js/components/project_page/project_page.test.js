import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import { ProjectPage } from "./index";
import { props } from "./props";

describe("ProjectPage", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<MemoryRouter><ProjectPage {...props} /></MemoryRouter>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
