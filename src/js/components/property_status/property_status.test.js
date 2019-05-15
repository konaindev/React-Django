import renderer from "react-test-renderer";
import PropertyStatus from "./index";

describe("PropertyStatus", () => {
  it.each([0, 1, 2])("renders correctly", performance_rating => {
    const tree = renderer
      .create(<PropertyStatus performance_rating={performance_rating} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
