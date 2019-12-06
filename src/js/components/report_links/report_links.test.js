import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import ReportLinks from "./index";
import props from "./props";

describe("ReportLinks", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <ReportLinks {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
