import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import PropertyCard from "./index";
import { props } from "./props";

describe("PropertyCard", () => {
  it("renders on-track", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PropertyCard {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders off-track", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PropertyCard {...props} performance_rating={0} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders at-risk", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PropertyCard {...props} performance_rating={1} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders selected", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PropertyCard {...props} selected={true} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
