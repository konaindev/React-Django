import renderer from "react-test-renderer";

import ShareToggle from "./index";

describe("ShareToggle", () => {
  it("renders share toggle correctly", () => {
    const tree = renderer
      .create(<ShareToggle shared={true} share_url={"link_copied"} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
