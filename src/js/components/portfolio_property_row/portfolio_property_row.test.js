import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import PortfolioPropertyRow from "./index";
import { props, withoutKPIs } from "./props";

describe("PortfolioPropertyRow", () => {
  it("renders on-track", () => {
    const tree = renderer.create(<MemoryRouter><PortfolioPropertyRow {...props} /></MemoryRouter>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders off-track", () => {
    const tree = renderer
      .create(<MemoryRouter><PortfolioPropertyRow {...props} health={0} /></MemoryRouter>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders at-risk", () => {
    const tree = renderer
      .create(<MemoryRouter><PortfolioPropertyRow {...props} health={1} /></MemoryRouter>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders withoutKPIs", () => {
    const tree = renderer
      .create(<MemoryRouter><PortfolioPropertyRow {...withoutKPIs} /></MemoryRouter>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
