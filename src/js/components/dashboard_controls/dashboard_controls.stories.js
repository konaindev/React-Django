import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";
import { action } from "@storybook/addon-actions";

import DashboardControls from "./index";
import { props } from "./props";

const filters = { q: "", ct: [], fd: [], am: [], pm: [] };

storiesOf("DashboardControls", module).add(
  "default",
  withState({ filters })(({ store }) => (
    <div style={{ margin: "auto", width: "1500px" }}>
      <DashboardControls
        {...props}
        filters={store.state.filters}
        onChange={filters => {
          store.set({ filters });
          action("onChange")(filters);
        }}
      />
    </div>
  ))
);
