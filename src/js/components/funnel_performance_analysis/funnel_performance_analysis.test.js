import renderer from "react-test-renderer";
import FunnelPerformanceAnalysis from "./index";
import props from "./FunnelProps";

describe("FunnelPerformanceAnalysis", () => {
  it("renders default correctly", () => {
    const tree = renderer
      .create(<FunnelPerformanceAnalysis {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with [] correctly", () => {
    const tree = renderer
      .create(<FunnelPerformanceAnalysis funnel_history={[]} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with null correctly", () => {
    const props = {
      name: "Volume of EXE",
      value: 3008,
      target: 2136,
      delta: 423
    };

    const tree = renderer
      .create(<FunnelPerformanceAnalysis funnel_history={null} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
