import React from "react";
import { storiesOf } from "@storybook/react";

import DashboardPage from "./index";

const props = {};

storiesOf("DashboardPage", module).add("default", () => (
  <DashboardPage {...props} />
));
