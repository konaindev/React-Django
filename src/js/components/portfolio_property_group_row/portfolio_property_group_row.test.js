import renderer from "react-test-renderer";

import PortfolioPropertyGroupRow from "./index";
import { props } from "./props";

describe("PortfolioPropertyGroupRow", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<PortfolioPropertyGroupRow {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders opened", () => {
    const component = renderer.create(<PortfolioPropertyGroupRow {...props} />);
    component.getInstance().toggleHandler();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
