import FormattedMultiple from "./index";
import renderer from "react-test-renderer";

describe("FormattedMultiple", () => {
  it("renders correctly", () => {
    const props = {
      value: 123
    };
    const tree = renderer.create(<FormattedMultiple {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
