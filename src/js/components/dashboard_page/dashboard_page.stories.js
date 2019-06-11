import React from "react";
import { storiesOf } from "@storybook/react";

import DashboardPage from "./index";
import { props } from "./props";

storiesOf("DashboardPage", module)
  .add("default", () => <DashboardPage {...props} />)
  .add("List view", () => <DashboardPage {...props} viewType="list" />)
  .add("List select", () => (
    <DashboardPage
      {...props}
      viewType="list"
      selectedProperties={[props.properties[0].property_id]}
    />
  ));
