import { shallow } from "enzyme";

import AcquisitionFunnelReport from "./index";

import { props_baseline, props_performance } from "./props";

describe("AcquisitionFunnelReport", () => {
  it("renders baseline report correctly", () => {
    let tree = shallow(<AcquisitionFunnelReport {...props_baseline} />);
    expect(tree.debug()).toMatchSnapshot();

    tree = shallow(<AcquisitionFunnelReport.HeadlineNumbers {...props_baseline} />);
    expect(tree.debug()).toMatchSnapshot();

    tree = shallow(<AcquisitionFunnelReport.FunnelContent {...props_baseline} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders performance report correctly", () => {
    let tree = shallow(<AcquisitionFunnelReport {...props_performance} />);
    expect(tree.debug()).toMatchSnapshot();

    tree = shallow(<AcquisitionFunnelReport.HeadlineNumbers {...props_performance} />);
    expect(tree.debug()).toMatchSnapshot();

    tree = shallow(<AcquisitionFunnelReport.FunnelContent {...props_performance} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
