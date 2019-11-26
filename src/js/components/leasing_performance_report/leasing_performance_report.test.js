import { shallow } from "enzyme";

import LeasingPerformanceReport from "./index";
import {
  props_baseline,
  props_performance,
  props_section_items
} from "./props";

describe("LeasingPerformanceReport", () => {
  it("renders baseline report correctly", () => {
    let tree = shallow(<LeasingPerformanceReport {...props_baseline} />);
    expect(tree.debug()).toMatchSnapshot();

    tree = shallow(<LeasingPerformanceReport.HeadlineNumbers {...props_baseline} />);
    expect(tree.debug()).toMatchSnapshot();

    tree = shallow(<LeasingPerformanceReport.DetailNumbers {...props_baseline} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders performance report correctly", () => {
    let tree = shallow(<LeasingPerformanceReport {...props_performance} />);
    expect(tree.debug()).toMatchSnapshot();

    tree = shallow(<LeasingPerformanceReport.HeadlineNumbers {...props_performance} />);
    expect(tree.debug()).toMatchSnapshot();

    tree = shallow(<LeasingPerformanceReport.DetailNumbers {...props_performance} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders with section items correctly", () => {
    const tree = shallow(<LeasingPerformanceReport {...props_section_items} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
