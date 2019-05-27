import { mount } from "enzyme";

import PropertyList from "./index";
import { props } from "./props";

describe("PropertyList", () => {
  it("renders correctly", () => {
    const wrapper = mount(<PropertyList {...props} selectionMode={true} />);
    expect(wrapper).toMatchSnapshot();

    wrapper
      .find(".property-row__selector")
      .first()
      .simulate("click");
    expect(wrapper).toMatchSnapshot();

    wrapper
      .find(".property-row__selector")
      .first()
      .simulate("click");
    expect(wrapper).toMatchSnapshot();
  });
});
