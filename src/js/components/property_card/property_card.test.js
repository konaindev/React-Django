import renderer from "react-test-renderer";
import PropertyCard from "./index";
import { props } from "./props";

describe("PropertyCard", () => {
  it("renders on-track", () => {
    const tree = renderer.create(<PropertyCard {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders off-track", () => {
    const tree = renderer
      .create(<PropertyCard {...props} performance_rating={0} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders at-risk", () => {
    const tree = renderer
      .create(<PropertyCard {...props} performance_rating={1} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
