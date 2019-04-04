import renderer from "react-test-renderer";
import RemarkablyLogo from "./index";

describe("RemarkablyLogo", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<RemarkablyLogo />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
