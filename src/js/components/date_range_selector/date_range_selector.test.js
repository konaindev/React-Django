import renderer from "react-test-renderer";

import DateRangeSelector from "./index";
import { props } from "./props";

describe("DateRangeSelector", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<DateRangeSelector {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
