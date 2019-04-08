import renderer from "react-test-renderer";
import PageHeader from "./index";

describe("PageHeader", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<PageHeader>header content</PageHeader>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
