import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import ReportSection from "./index";
import ReportDateSpan from "../report_date_span";

const props_default = {
  name: "Test Name"
};

const props_report_date_span = {
  name: "Test Name",
  sectionItems: (
    <ReportDateSpan
      name="Report Span"
      dates={{ start: "2018-01-01", end: "2018-02-01" }}
    />
  )
};

storiesOf("ReportSection", module)
  .add("default", () => <ReportSection {...props_default} />)
  .add("with report date span", () => (
    <ReportSection {...props_report_date_span} />
  ));
