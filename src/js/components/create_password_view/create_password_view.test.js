import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import { CreatePasswordView } from "./index";
import { props } from "./props";

jest.mock("rc-tooltip");

describe("CreatePasswordView", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <CreatePasswordView {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
