import React from "react";
import { storiesOf } from "@storybook/react";

import DashboardPage from "./index";
import { props } from "./props";

storiesOf("DashboardPage", module)
  .add("default", () => <DashboardPage {...props} />)
  .add("Row view", () => <DashboardPage {...props} viewType="row" />)
  .add("Row select", () => (
    <DashboardPage
      {...props}
      viewType="row"
      selectedProperties={[props.properties[0].property_id]}
    />
  ));
