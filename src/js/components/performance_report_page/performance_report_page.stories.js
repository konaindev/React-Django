import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { PerformanceReportPage } from "./index";
import props from "./props";

storiesOf("PerformanceReportPage", module).add("default", () => (
  <PerformanceReportPage {...props} />
));
