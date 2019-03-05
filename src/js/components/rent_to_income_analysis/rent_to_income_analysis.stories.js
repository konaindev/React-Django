import React from "react";

import { storiesOf } from "@storybook/react";

import RentToIncomeAnalysis from "./index";

const props_small = {
  categories: [
    {
      name: "Low",
      low: 0.0,
      high: 0.12
    },
    {
      name: "Moderately Low",
      low: 0.12,
      high: 0.24
    },
    {
      name: "Target",
      low: 0.24,
      high: 0.35
    },
    {
      name: "Moderately High",
      low: 0.35,
      high: 0.45
    },
    {
      name: "High",
      low: 0.45,
      high: 0.55
    }
  ],
  incomes: [
    "50000.00",
    "100000.00",
    "200000.00",
    "300000.00",
    "400000.00",
    "500000.00"
  ],
  rental_rates: [
    "1000.00",
    "2000.00",
    "3000.00",
    "4000.00",
    "5000.00",
    "6000.00"
  ],
  data: [
    [0.24, 0.48, null, null, null, null],
    [0.12, 0.24, 0.36, 0.48, null, null],
    [0.06, 0.12, 0.18, 0.24, 0.3, 0.36],
    [0.04, 0.08, 0.12, 0.16, 0.2, 0.24],
    [0.03, 0.06, 0.09, 0.12, 0.15, 0.18],
    [0.02, 0.05, 0.07, 0.1, 0.12, 0.14]
  ]
};

const props_large = {
  categories: [
    {
      name: "Low",
      low: 0.0,
      high: 0.12
    },
    {
      name: "Moderately Low",
      low: 0.12,
      high: 0.24
    },
    {
      name: "Target",
      low: 0.24,
      high: 0.35
    },
    {
      name: "Moderately High",
      low: 0.35,
      high: 0.45
    },
    {
      name: "High",
      low: 0.45,
      high: 0.55
    }
  ],
  incomes: [
    "50000.00",
    "100000.00",
    "200000.00",
    "300000.00",
    "400000.00",
    "500000.00",
    "600000.00",
    "700000.00",
    "800000.00",
    "900000.00",
    "1000000.00",
    "1100000.00"
  ],
  rental_rates: [
    "1000.00",
    "2000.00",
    "3000.00",
    "4000.00",
    "5000.00",
    "6000.00",
    "7000.00",
    "8000.00",
    "9000.00",
    "10000.00",
    "11000.00",
    "12000.00"
  ],
  data: [
    [0.24, 0.48, null, null, null, null, null, null, null, null, null, null],
    [0.12, 0.24, 0.36, 0.48, null, null, null, null, null, null, null, null],
    [0.06, 0.12, 0.18, 0.24, 0.3, 0.36, 0.42, 0.48, 0.54, null, null, null],
    [0.04, 0.08, 0.12, 0.16, 0.2, 0.24, 0.28, 0.32, 0.36, 0.4, 0.44, 0.48],
    [0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.21, 0.24, 0.27, 0.3, 0.33, 0.36],
    [0.02, 0.05, 0.07, 0.1, 0.12, 0.14, 0.17, 0.19, 0.22, 0.24, 0.26, 0.29]
  ]
};

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
