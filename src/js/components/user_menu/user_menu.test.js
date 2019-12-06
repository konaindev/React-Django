import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import { UserMenu } from "./index";
import { props } from "./props";

describe("UserMenu", () => {
  it("render default", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserMenu {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render opened", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserMenu {...props} menuIsOpen />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
