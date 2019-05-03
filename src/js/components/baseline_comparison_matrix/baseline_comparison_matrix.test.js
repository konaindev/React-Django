import BaselineComparisonMatrix from "./index";
import renderer from "react-test-renderer";
import { props } from "./props";

describe("BaselineComparisonMatrix", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<BaselineComparisonMatrix {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
