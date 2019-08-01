import renderer from "react-test-renderer";

import CreatePasswordView from "./index";

describe("CreatePasswordView", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<CreatePasswordView />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
