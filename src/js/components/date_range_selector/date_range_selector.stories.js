import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";
import { action } from "@storybook/addon-actions";

import DateRangeSelector from "./index";
import { props } from "./props";

storiesOf("DateRangeSelector", module).add(
  "default",
  withState({ ...props })(({ store }) => (
    <DateRangeSelector
      {...store.state}
      onChange={(preset, start_date, end_date) => {
        store.set({ preset, start_date, end_date });
        action("onChange")();
      }}
    />
  ))
);
