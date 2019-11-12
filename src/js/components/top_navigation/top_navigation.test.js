import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import TopNavigation from "./index";
import { props } from "./props";

describe("TopNavigation", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <TopNavigation {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
