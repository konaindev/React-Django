import AcquisitionFunnelReport from "./index";
import renderer from "react-test-renderer";

import {
  props_baseline,
  props_performance
} from "./props";

describe("AcquisitionFunnelReport", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  it("renders baseline report correctly", () => {
    const tree = renderer
      .create(<AcquisitionFunnelReport {...props_baseline} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders performance report correctly", () => {
    const tree = renderer
      .create(<AcquisitionFunnelReport {...props_performance} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
