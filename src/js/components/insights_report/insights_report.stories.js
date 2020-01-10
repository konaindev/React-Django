import React from "react";
import { storiesOf } from "@storybook/react";

import InsightsReport from "./index";
import { props } from "./props";

storiesOf("InsightsReport", module)
  .add("default", () => <InsightsReport {...props} />)
  .add("No insights", () => <InsightsReport />);
