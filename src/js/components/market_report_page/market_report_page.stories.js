import React from "react";

import { storiesOf } from "@storybook/react";

import props from "./props";
import MarketReportPage from "./index";

storiesOf("MarketReportPage", module).add("default", () => (
  <MarketReportPage {...props} />
));
