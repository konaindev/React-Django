import { shallow } from "enzyme";

import ModelingView from "./index";
import { props } from "./props";

describe("ModelingView", () => {
  it("renders correctly", () => {
    const tree = shallow(<ModelingView {...props} />);
    expect(tree.debug()).toMatchSnapshot();

    tree.setState({ activeReportIndex: "compare" });
    expect(tree.debug()).toMatchSnapshot();
  });
});
