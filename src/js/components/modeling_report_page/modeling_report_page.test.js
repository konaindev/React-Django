import renderer from "react-test-renderer";

import ModelingReportPage from "./index";
import props from "./props.js";

describe("ModelingReportPage", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<ModelingReportPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
