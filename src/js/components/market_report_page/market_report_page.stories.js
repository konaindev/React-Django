import React from "react";

import { storiesOf } from "@storybook/react";

import MarketReportPage from "./index";

const props = {};

storiesOf("MarketReportPage", module).add("default", () => (
  <MarketReportPage {...props} />
));
