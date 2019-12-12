import renderer from "react-test-renderer";

import { ErrorContainer } from "./index";
import props from "./props";

describe("ErrorContainer", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<ErrorContainer {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
