import renderer from "react-test-renderer";

import CloseIcon from "./index";

describe("CloseIcon", () => {
  it("renders default close icon correctly", () => {
    const tree = renderer.create(<CloseIcon />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
