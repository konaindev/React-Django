import React from "react";

import { storiesOf } from "@storybook/react";

import { currentReportType, reportLinksAll, reportLinksPartial } from "./props";

import ReportLinks from "./index";

storiesOf("ReportLinks", module)
  .add("default", () => {
    return (
      <ReportLinks {...{ currentReportType, reportLinks: reportLinksAll }} />
    );
  })
  .add("No Campaign/Marketing", () => {
    return (
      <ReportLinks
        {...{ currentReportType, reportLinks: reportLinksPartial }}
      />
    );
  });
