import { shallow } from "enzyme";

import {
  InvestmentAllocation,
  AcquisitionDetails,
  RetentionDetails,
  InvestmentAllocationChart
} from "./index";
import { props, propsFill } from "./props";

describe("InvestmentAllocation", () => {
  it("renders <InvestmentAllocation />", () => {
    const tree = shallow(<InvestmentAllocation {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders <InvestmentAllocation.AcquisitionDetails />", () => {
    const tree = shallow(<AcquisitionDetails {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders <InvestmentAllocation.RetentionDetails />", () => {
    const tree = shallow(<RetentionDetails {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders <InvestmentAllocation.InvestmentAllocationChart /> acquisition type", () => {
    const tree = shallow(
      <InvestmentAllocationChart name="acquisition" {...props.acquisition} />
    );
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders <InvestmentAllocation.InvestmentAllocationChart /> retention type", () => {
    let tree = shallow(
      <InvestmentAllocationChart name="retention" {...props.retention} />
    );
    expect(tree.debug()).toMatchSnapshot();

    tree = shallow(
      <InvestmentAllocationChart name="retention" {...propsFill.retention} />
    );
    expect(tree.debug()).toMatchSnapshot();
  });
});
