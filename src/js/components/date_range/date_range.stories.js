import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";
import { action } from "@storybook/addon-actions";

import DateRange from "./index";

storiesOf("DateRange", module).add(
  "default",
  withState({
    startDate: null,
    endDate: null
  })(({ store }) => (
    <div style={{ marginLeft: 100 }}>
      <DateRange
        {...store.state}
        onChange={(startDate, endDate) => {
          store.set({ startDate, endDate });
          action("onChange")(startDate, endDate);
        }}
      />
    </div>
  ))
);
