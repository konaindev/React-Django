import renderer from "react-test-renderer";
import { MemoryRouter, withRouter } from "react-router-dom";

import { CreatePasswordView } from "./index";
import { props } from "./props";

jest.mock("rc-tooltip");

const WrappedComponent = withRouter(CreatePasswordView);

describe("CreatePasswordView", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <WrappedComponent />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
