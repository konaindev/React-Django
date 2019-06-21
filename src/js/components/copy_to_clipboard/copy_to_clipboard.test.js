import renderer from "react-test-renderer";

import CopyToClipboard from "./index";

describe("CopyToClipboard", () => {
  it("renders enabled button correctly", () => {
    const tree = renderer
      .create(<CopyToClipboard textToCopy="Some Text" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders disabled button correctly", () => {
    const tree = renderer
      .create(<CopyToClipboard disabled textToCopy="Some Text" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
