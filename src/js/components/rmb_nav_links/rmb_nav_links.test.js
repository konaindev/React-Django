import { shallow } from "enzyme";

import RmbNavLinks from "./index";
import { basicOptions } from "./props";

describe("ReportLinks", () => {
  it("renders basic options correctly", () => {
    const tree = shallow(
      <RmbNavLinks options={basicOptions} selected={store.state.value} />
    );
    expect(tree).toMatchSnapshot();
  });
});
