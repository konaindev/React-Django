import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import PageHeader from "./index";

describe("PageHeader", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PageHeader>header content</PageHeader>
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
