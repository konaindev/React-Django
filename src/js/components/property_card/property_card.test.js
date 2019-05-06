import renderer from "react-test-renderer";
import PropertyCard from "./index";
import { props } from "./props";

describe("PropertyCard", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<PropertyCard {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
