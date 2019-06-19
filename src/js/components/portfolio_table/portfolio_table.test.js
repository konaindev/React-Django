import renderer from "react-test-renderer";

import PortfolioTable from "./index";
import { props } from "./props";

describe("PortfolioTable", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<PortfolioTable {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
