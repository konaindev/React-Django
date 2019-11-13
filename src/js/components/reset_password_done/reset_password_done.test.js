import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import ResetPasswordDone from "./index";

describe("ResetPasswordDone", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <ResetPasswordDone></ResetPasswordDone>
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
