import renderer from "react-test-renderer";

import SearchField from "./index";

describe("SearchField", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SearchField />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders with children", () => {
    const tree = renderer
      .create(
        <SearchField>
          <div>field 1</div>
          <div>field 2</div>
          <div>field 3</div>
        </SearchField>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("active", () => {
    const tree = renderer.create(<SearchField value="search" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("custom placeholder", () => {
    const tree = renderer
      .create(<SearchField placeholder="placeholder" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
