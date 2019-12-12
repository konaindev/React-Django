import React from "react";

import { storiesOf } from "@storybook/react";

import RentToIncomeAnalysis from "./index";
import { props_large, props_small } from "./props";

storiesOf("RentToIncomeAnalysis", module)
  .add("small", () => (
    <div style={{ width: 1320, margin: "80px auto" }}>
      <RentToIncomeAnalysis {...props_small} />
    </div>
  ))
  .add("large", () => (
    <div style={{ width: 1320, margin: "80px auto" }}>
      <RentToIncomeAnalysis {...props_large} />
    </div>
  ));

export default RentToIncomeAnalysis;
