import CommonReport from "./index";
import renderer from "react-test-renderer";
import { props_baseline, props_performance, props_date_span } from "./props";

describe("CommonReport", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  it("renders baseline report correctly", () => {
    const tree = renderer.create(<CommonReport {...props_baseline} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders performance report correctly", () => {
    const tree = renderer
      .create(<CommonReport {...props_performance} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with date span correctly", () => {
    const tree = renderer
      .create(<CommonReport {...props_date_span} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
