import { shallow } from "enzyme";

import { FunnelBaseBox, FunnelNumberBox, FunnelPercentBox, FunnelCurrencyBox } from "./index";
import { props1, props2, props3 } from "./props";

describe("FunnelBoxLayout", () => {
  it("renders FunnelNumberBox correctly", () => {
    const tree = shallow(<FunnelNumberBox {...props1} />);
    expect(tree.dive().debug()).toMatchSnapshot();
  });

  it("renders FunnelPercentBox correctly", () => {
    const tree = shallow(<FunnelPercentBox {...props2} />);
    expect(tree.dive().debug()).toMatchSnapshot();
  });

  it("renders FunnelCurrencyBox correctly", () => {
    const tree = shallow(<FunnelCurrencyBox {...props3} />);
    expect(tree.dive().debug()).toMatchSnapshot();
  });
});
