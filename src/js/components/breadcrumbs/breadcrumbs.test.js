import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import Breadcrumbs from "./index";

describe("Breadcrumbs", () => {
  it("renders correctly", () => {
    const props = {
      breadcrumbs: [
        {
          text: "Releases",
          link: "/releases"
        },
        {
          text: "2.15.8 Release Title | 3/21/2019"
        }
      ]
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <Breadcrumbs {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
