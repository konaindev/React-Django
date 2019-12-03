import { shallow } from "enzyme";
import { CurrencyShorthandGraphBox, PercentageGraphBox } from "./index";

describe("LargeGraphBox", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  it("renders PercentageGraphBox correctly", () => {
    const props = {
      name: "USV > EXE",
      infoTooltip: "usv_to_exe",
      value: 0.1,
      target: 0.13,
      delta: 0.03,
      series: [10, 20, 30, 15]
    };

    const tree = shallow(<PercentageGraphBox {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders PercentageGraphBox correctly with null target value", () => {
    const props = {
      name: "USV > EXE",
      value: 0.1,
      target: null,
      delta: 0.03,
      series: [10, 20, 30, 15]
    };
    const tree = shallow(<PercentageGraphBox {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders PercentageGraphBox correctly with undefined target value", () => {
    const props = {
      name: "USV > EXE",
      value: 0.1,
      delta: 0.03,
      series: [10, 20, 30, 15]
    };
    const tree = shallow(<PercentageGraphBox {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders PercentageGraphBox with extra content correctly", () => {
    const props = {
      name: "USV > EXE",
      value: 0.1,
      target: 0.13,
      delta: 0.03,
      extraContent: "227 Executed Leases (Out of 260)",
      series: [10, 20, 30, 15]
    };
    const tree = shallow(<PercentageGraphBox {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders CurrencyShorthandGraphBox correctly", () => {
    const props = {
      name: "USV > EXE",
      value: 13456,
      target: 32423,
      delta: 1232,
      series: [10, 20, 30, 15]
    };

    const tree = shallow(<CurrencyShorthandGraphBox {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders CurrencyShorthandGraphBox with extra content correctly", () => {
    const props = {
      name: "USV > EXE",
      value: 12345,
      target: 32343,
      delta: 132,
      extraContent: "227 Executed Leases (Out of 260)",
      series: [10, 20, 30, 15]
    };
    const tree = shallow(<CurrencyShorthandGraphBox {...props} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
