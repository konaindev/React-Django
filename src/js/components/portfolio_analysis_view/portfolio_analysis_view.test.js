import renderer from "react-test-renderer";

import { PortfolioAnalysisView } from "./index";
import { props } from "./props";

describe("PortfolioAnalysisView", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<PortfolioAnalysisView {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
