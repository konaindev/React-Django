import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import ReportDateSpan from "./index";

const props = {
  name: "Report Span",
  dates: {
    start: "2018-01-01",
    end: "2018-02-01"
  }
};

storiesOf("ReportDateSpan", module).add("default", () => (
  <ReportDateSpan {...props} />
));
