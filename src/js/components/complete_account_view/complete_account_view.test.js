import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import { CompleteAccountView } from "./index";
import { props } from "./props";

describe("CompleteAccountView", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <CompleteAccountView {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
