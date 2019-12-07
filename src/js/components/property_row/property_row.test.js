import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import PropertyRow from "./index";
import { props } from "./props";

describe("PropertyRow", () => {
  it("renders on-track", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PropertyRow {...props} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders off-track", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PropertyRow {...props} performance_rating={0} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders at-risk", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PropertyRow {...props} performance_rating={1} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders selection mode", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PropertyRow {...props} selection_mode={true} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders selected", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PropertyRow {...props} selection_mode={true} selected={true} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
