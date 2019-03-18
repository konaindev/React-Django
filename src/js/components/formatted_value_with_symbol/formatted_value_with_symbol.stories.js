import React from "react";

import { storiesOf } from "@storybook/react";

import { formatNumber, formatCurrencyShorthand } from "../../utils/formatters";
import FormattedValueWithSymbol from "./index";

const props1 = {
  value: "495200.00",
  formatter: formatCurrencyShorthand
};

const props2 = {
  value: "354000.00",
  formatter: formatCurrencyShorthand,
  symbolType: "sign"
};

const props3 = {
  value: -34,
  formatter: formatNumber,
  symbolType: "multiple"
};

storiesOf("FormattedValueWithSymbol", module)
  .add("default", () => <FormattedValueWithSymbol {...props1} />)
  .add("plus/minus sign", () => <FormattedValueWithSymbol {...props2} />)
  .add("multiple-x", () => <FormattedValueWithSymbol {...props3} />);
