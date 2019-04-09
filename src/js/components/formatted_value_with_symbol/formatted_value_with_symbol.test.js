import FormattedValueWithSymbol from "./index";
import renderer from "react-test-renderer";
import { formatNumber, formatCurrencyShorthand } from "../../utils/formatters";

describe("FormattedValueWithSymbol", () => {
  it("renders default correctly", () => {
    const props = {
      value: "495200.00",
      formatter: formatCurrencyShorthand
    };

    const tree = renderer
      .create(<FormattedValueWithSymbol {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders plus/minus sign correctly", () => {
    const props = {
      value: "354000.00",
      formatter: formatCurrencyShorthand,
      symbolType: "sign"
    };

    const tree = renderer
      .create(<FormattedValueWithSymbol {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders multiple-x correctly", () => {
    const props = {
      value: -34,
      formatter: formatNumber,
      symbolType: "multiple"
    };

    const tree = renderer
      .create(<FormattedValueWithSymbol {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
