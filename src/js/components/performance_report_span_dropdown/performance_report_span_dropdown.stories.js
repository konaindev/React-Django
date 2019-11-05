import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withState } from "@dump247/storybook-state";

import {
  props,
  last_week,
  last_two_weeks,
  last_four_weeks,
  campaign
} from "./props";

import PerformanceReportSpanDropdown from "./index";

storiesOf("PerformanceReportSpanDropdown", module).add(
  "default",
  withState({ ...props })(({ store }) => (
    <PerformanceReportSpanDropdown
      {...store.state}
      onChange={(preset, ...args) => {
        switch (preset) {
          case "last-week":
            store.set(last_week);
            break;
          case "last-two-weeks":
            store.set(last_two_weeks);
            break;
          case "last-four-weeks":
            store.set(last_four_weeks);
            break;
          case "campaign":
            store.set(campaign);
            break;
          case "custom":
            let range = args[0].split(",");
            store.set({
              preset: "",
              start_date: range[0],
              end_date: range[1]
            });
            break;
          default:
            store.set(props);
        }
        action("onChange")();
      }}
    />
  ))
);
