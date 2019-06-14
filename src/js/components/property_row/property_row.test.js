import renderer from "react-test-renderer";
import Container from "../container";

import PropertyRow from "./index";
import { props } from "./props";

describe("PropertyRow", () => {
  it("renders on-track", () => {
    const tree = renderer.create(<PropertyRow {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders off-track", () => {
    const tree = renderer
      .create(<PropertyRow {...props} performance_rating={0} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders at-risk", () => {
    const tree = renderer
      .create(<PropertyRow {...props} performance_rating={1} />)
      .toJSON();
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
