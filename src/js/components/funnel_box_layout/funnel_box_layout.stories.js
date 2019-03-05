import React from "react";

import { storiesOf } from "@storybook/react";

import { FunnelNumberBox, FunnelPercentBox, FunnelCurrencyBox } from "./index";

const props1 = {
  name: "Volume of EXE",
  value: 3008,
  target: 2136,
  delta: 423
};

const props2 = {
  name: "USV > INQ",
  value: 0.32,
  target: 0.216,
  delta: 0.023
};

const props3 = {
  name: "Volume of EXE",
  value: 3008,
  target: 2136,
  delta: 423
};

storiesOf("FunnelBoxLayout", module)
  .add("number", () => <FunnelNumberBox {...props1} />)
  .add("percentage", () => <FunnelPercentBox {...props2} />)
  .add("currency", () => <FunnelCurrencyBox {...props3} />);
