import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import RemarkablyLogo from "./index";

describe("RemarkablyLogo", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<MemoryRouter><RemarkablyLogo /></MemoryRouter>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
