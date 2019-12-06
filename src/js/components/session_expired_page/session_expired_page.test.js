import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import { SessionExpiredPage } from "./index";

describe("SessionExpired", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <SessionExpiredPage />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
