import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import PageAuth from "./index";

describe("PageAuth", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PageAuth backLink="/">
            <div>children</div>
          </PageAuth>
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without back link", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PageAuth>
            <div>children</div>
          </PageAuth>
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
