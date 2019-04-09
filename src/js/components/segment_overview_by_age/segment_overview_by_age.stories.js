import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import SegmentOverviewByAge from "./index";

export const props = {
  age_group: "18-24",
  segment_population: 10368,
  total_population: 120448,
  segment_number: 1,
  income_groups: [
    {
      income: "50000.00",
      group_population: 3452,
      home_owners: {
        total: 231,
        family: 114,
        nonfamily: 117
      },
      renters: {
        total: 3311,
        family: 517,
        nonfamily: 2794
      },
      active_populations: ["renters.nonfamily"],
      market_size: 2794
    },
    {
      income: "75000.00",
      group_population: 3188,
      home_owners: {
        total: 249,
        family: 123,
        nonfamily: 126
      },
      renters: {
        total: 2940,
        family: 459,
        nonfamily: 2481
      },
      market_size: 2481,
      active_populations: ["renters.nonfamily"]
    },
    {
      income: "100000.00",
      group_population: 1587,
      home_owners: {
        total: 164,
        family: 81,
        nonfamily: 83
      },
      renters: {
        total: 1423,
        family: 83,
        nonfamily: 1201
      },
      market_size: 1201,
      active_populations: ["renters.nonfamily"]
    }
  ]
};

storiesOf("SegmentOverviewByAge", module).add("default", () => (
  <SegmentOverviewByAge {...props} />
));
