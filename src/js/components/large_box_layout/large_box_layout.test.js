import { shallow } from "enzyme";

import { LargeBoxLayout } from "./index";

const props = {
  name: "Test name",
  content: "Test content",
  detail: "This is details",
  detail2: "This is more details",
  innerBox: null
};

describe("LargeBoxLayout", () => {
  it("renders correctly", () => {
    const tree = shallow(<LargeBoxLayout {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders with tooltip correctly", () => {
    const props2 = {
      ...props,
      infoTooltip: "i18n_key"
    };
    const tree = shallow(<LargeBoxLayout {...props2} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
