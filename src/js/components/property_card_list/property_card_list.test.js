import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import PropertyCardList from "./index";
import { props } from "./props";

describe("PropertyCardList", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PropertyCardList {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
