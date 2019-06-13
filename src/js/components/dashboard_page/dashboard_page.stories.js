import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";
import { action } from "@storybook/addon-actions";

import { DashboardPage } from "./index";
import { props } from "./props";

storiesOf("DashboardPage", module)
  .add(
    "default",
    withState({ filters: {} })(({ store }) => (
      <DashboardPage
        {...props}
        filters={store.state.filters}
        onChangeFilter={filters => {
          store.set({ filters });
          action("onChange")(filters);
        }}
      />
    ))
  )
  .add("List view", () => <DashboardPage {...props} viewType="list" />)
  .add("List select", () => (
    <DashboardPage
      {...props}
      viewType="list"
      selectedProperties={[props.properties[0].property_id]}
    />
  ));
