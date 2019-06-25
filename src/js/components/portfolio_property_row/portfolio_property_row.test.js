import renderer from "react-test-renderer";

import PortfolioPropertyRow from "./index";
import { props } from "./props";

describe("PortfolioPropertyRow", () => {
  it("renders on-track", () => {
    const tree = renderer.create(<PortfolioPropertyRow {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders off-track", () => {
    const tree = renderer
      .create(<PortfolioPropertyRow {...props} health={0} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders at-risk", () => {
    const tree = renderer
      .create(<PortfolioPropertyRow {...props} health={1} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
