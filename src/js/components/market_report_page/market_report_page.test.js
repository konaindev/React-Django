import renderer from "react-test-renderer";

import MarketReportPage from "./index";
import props from "./props";

describe("MarketReportPage", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<MarketReportPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
