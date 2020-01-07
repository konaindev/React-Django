import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import { ProjectPage } from "./index";
import { props } from "./props";

describe("ProjectPage", () => {
  beforeEach(() => {
    Object.defineProperty(window, "analytics", {
      value: {
        page: x => x
      }
    });
  });
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <ProjectPage {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
