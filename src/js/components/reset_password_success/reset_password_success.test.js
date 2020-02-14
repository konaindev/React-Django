import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import ResetPasswordSuccess from "./index";

describe("ResetPasswordSuccess", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <ResetPasswordSuccess></ResetPasswordSuccess>
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
