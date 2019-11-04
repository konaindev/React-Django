import renderer from "react-test-renderer";

import PortfolioPropertyGroupRow from "./index";
import { props, withoutKPIs } from "./props";
import { BrowserRouter } from "react-router-dom";

describe("PortfolioPropertyGroupRow", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <PortfolioPropertyGroupRow {...props} />
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders opened", () => {
    const component = renderer.create(
      <BrowserRouter>
        <PortfolioPropertyGroupRow {...props} />
      </BrowserRouter>
    );
    component.getInstance().toggleHandler();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without KPIs", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <PortfolioPropertyGroupRow {...withoutKPIs} />
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
