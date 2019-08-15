import renderer from "react-test-renderer";

import CompleteAccountView from "./index";
import { props } from "./props";

describe("CompleteAccountView", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<CompleteAccountView {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
