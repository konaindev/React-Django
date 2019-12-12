import { shallow } from "enzyme";

import RmbNavLinks from "./index";
import { basicOptions, tooltipOptions } from "./props";

describe("ReportLinks", () => {
  it("renders basic options correctly", () => {
    const tree = shallow(
      <RmbNavLinks options={basicOptions} selected={basicOptions[0].value} />
    );
    expect(tree).toMatchSnapshot();
  });

  it("renders options with tooltips correctly", () => {
    const tree = shallow(
      <RmbNavLinks
        options={tooltipOptions}
        selected={tooltipOptions[0].value}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
