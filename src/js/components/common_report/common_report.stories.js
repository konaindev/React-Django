import React from "react";

import { storiesOf } from "@storybook/react";

import CommonReport from "./index";
import {
  propsForBaselineReport,
  propsForPerformanceReport,
  propsForPeformanceReportWithDateSpan
} from "./props";

const propsForBaselineReportWithoutCompetitors = {
  ...propsForBaselineReport,
  competitors: []
};

storiesOf("CommonReport", module).add("baseline with competitors", () => (
  <CommonReport {...propsForBaselineReport} />
));

storiesOf("CommonReport", module).add("baseline without competitors", () => (
  <CommonReport {...propsForBaselineReportWithoutCompetitors} />
));

storiesOf("CommonReport", module).add("performance", () => (
  <CommonReport {...propsForPerformanceReport} />
));

storiesOf("CommonReport", module).add("with date span", () => (
  <CommonReport {...propsForPeformanceReportWithDateSpan} />
));
