import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import ProjectLink from "./index";
import { props } from "./props";

describe("ProjectLink", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <ProjectLink {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
