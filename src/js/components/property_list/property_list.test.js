import renderer from "react-test-renderer";

import PropertyList from "./index";
import { props } from "./props";

describe("PropertyList", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<PropertyList {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
