import { shallow } from "enzyme";

import { SmallBoxLayout } from "./index";
import props from "./props";

describe("SmallBoxLayout", () => {
  it("renders correctly", () => {
    const tree = shallow(<SmallBoxLayout {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
