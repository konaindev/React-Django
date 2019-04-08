import renderer from "react-test-renderer";
import { FunnelNumberBox, FunnelPercentBox, FunnelCurrencyBox } from "./index";

describe("FunnelBoxLayout", () => {
  it("renders FunnelNumberBox correctly", () => {
    const props = {
      name: "Volume of EXE",
      value: 3008,
      target: 2136,
      delta: 423
    };

    const tree = renderer.create(<FunnelNumberBox {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders FunnelPercentBox correctly", () => {
    const props = {
      name: "USV > INQ",
      value: 0.32,
      target: 0.216,
      delta: 0.023
    };

    const tree = renderer.create(<FunnelPercentBox {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders FunnelCurrencyBox correctly", () => {
    const props = {
      name: "Volume of EXE",
      value: 3008,
      target: 2136,
      delta: 423
    };

    const tree = renderer.create(<FunnelCurrencyBox {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
