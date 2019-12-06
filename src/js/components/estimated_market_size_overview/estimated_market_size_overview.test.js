import { shallow } from "enzyme";

import EstimatedMarketSizeOverview from "./index";

import props from "./props";

describe("EstimatedMarketSizeOverview", () => {
  it("renders correctly", () => {
    const tree = shallow(<EstimatedMarketSizeOverview {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
