import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { CurrencyShorthandGraphBox, PercentageGraphBox } from "./index";

const props1 = {
  name: "USV > EXE",
  value: 0.1,
  target: 0.13,
  delta: 0.03,
  series: [10, 20, 30, 15]
};

const props2 = {
  name: "USV > EXE",
  value: 0.1,
  target: 0.13,
  delta: 0.03,
  extraContent: "227 Executed Leases (Out of 260)",
  series: [10, 20, 30, 15]
};

const props3 = {
  name: "USV > EXE",
  value: 13456,
  target: 32423,
  delta: 1232,
  series: [10, 20, 30, 15]
};

const props4 = {
  name: "USV > EXE",
  value: 12345,
  target: 32343,
  delta: 132,
  extraContent: "227 Executed Leases (Out of 260)",
  series: [10, 20, 30, 15]
};

storiesOf("LargeGraphBox", module)
  .add("PercentageGraphBox default", () => (
    <div style={{ width: 420 }}>
      <PercentageGraphBox {...props1} />
    </div>
  ))
  .add("PercentageGraphBox with extra content", () => (
    <div style={{ width: 420 }}>
      <PercentageGraphBox {...props2} />
    </div>
  ))
  .add("CurrencyShorthandGraphBox default", () => (
    <div style={{ width: 420 }}>
      <CurrencyShorthandGraphBox {...props3} />
    </div>
  ))
  .add("CurrencyShorthandGraphBox with extra content", () => (
    <div style={{ width: 420 }}>
      <CurrencyShorthandGraphBox {...props4} />
    </div>
  ));