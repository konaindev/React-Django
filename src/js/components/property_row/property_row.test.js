import renderer from "react-test-renderer";

import PropertyRow from "./index";
import { props } from "./props";

describe("PropertyRow", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<PropertyRow {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders selection mode", () => {
    const tree = renderer
      .create(<PropertyRow {...props} selection_mode={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders selected", () => {
    const tree = renderer
      .create(<PropertyRow {...props} selection_mode={true} selected={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
