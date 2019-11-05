import renderer from "react-test-renderer";

import InvestmentAllocation from "./index";
import { props, propsFill } from "./props";

describe("SectionHeader", () => {
  it("renders empty pie", () => {
    const tree = renderer.create(<InvestmentAllocation {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders 100% pie", () => {
    const tree = renderer
      .create(<InvestmentAllocation {...propsFill} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
