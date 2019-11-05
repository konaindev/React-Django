import renderer from "react-test-renderer";
import ReportLinks from "./index";
import props from "./props";

describe("ReportLinks", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<ReportLinks {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
