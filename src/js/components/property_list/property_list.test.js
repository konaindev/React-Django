import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import PropertyList from "./index";
import { props } from "./props";

describe("PropertyList", () => {
  it("renders correctly", () => {
    const tree = renderer.create(
      <MemoryRouter>
        <PropertyList {...props} />
      </MemoryRouter>
    );
    expect(tree).toMatchSnapshot();
  });
});
