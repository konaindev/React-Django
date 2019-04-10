import LeasingPerformanceReport from "./index";
import renderer from "react-test-renderer";
import {
  props_baseline,
  props_performance,
  props_section_items
} from "./props";

describe("LeasingPerformanceReport", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  it("renders baseline report correctly", () => {
    const tree = renderer
      .create(<LeasingPerformanceReport {...props_baseline} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders performance report correctly", () => {
    const tree = renderer
      .create(<LeasingPerformanceReport {...props_performance} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with section items correctly", () => {
    const tree = renderer
      .create(<LeasingPerformanceReport {...props_section_items} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
