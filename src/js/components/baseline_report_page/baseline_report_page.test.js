import BaselineReportPage from "./index";
import renderer from "react-test-renderer";
import { props } from "./props";

describe("BaselineReportPage", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<BaselineReportPage {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
