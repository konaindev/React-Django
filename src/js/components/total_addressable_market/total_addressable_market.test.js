import { shallow } from "enzyme";

import TotalAddressableMarket from "./index";
import props from "./props";

describe("TotalAddressableMarket", () => {
  it("renders correctly", () => {
    const tree = shallow(<TotalAddressableMarket {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
