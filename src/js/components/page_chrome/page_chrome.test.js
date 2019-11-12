import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import PageChrome from "./index";

describe("PageChrome", () => {
  it("renders correctly", () => {
    const props = {
      headerItems: <div>headerItems</div>,
      topItems: <div>topItems</div>,
      children: <div>children</div>
    };

    const tree = renderer
      .create(
        <MemoryRouter>
          <PageChrome {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
