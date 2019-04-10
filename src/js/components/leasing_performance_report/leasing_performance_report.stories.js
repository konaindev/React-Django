import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import LeasingPerformanceReport from "./index";
import {
  props_baseline,
  props_performance,
  props_section_items
} from "./props";

storiesOf("LeasingPerformanceReport", module).add("baseline", () => (
  <LeasingPerformanceReport {...props_baseline} />
));

storiesOf("LeasingPerformanceReport", module).add("performance", () => (
  <LeasingPerformanceReport {...props_performance} />
));

storiesOf("LeasingPerformanceReport", module).add("with section items", () => (
  <LeasingPerformanceReport {...props_section_items} />
));
