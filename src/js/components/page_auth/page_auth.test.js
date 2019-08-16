import renderer from "react-test-renderer";

import PageAuth from "./index";

describe("PageAuth", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <PageAuth backLink="/">
          <div>children</div>
        </PageAuth>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without back link", () => {
    const tree = renderer
      .create(
        <PageAuth>
          <div>children</div>
        </PageAuth>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
