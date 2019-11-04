import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import {
  currentReportType,
  report_link_all,
  report_link_no_campaign_market
} from "./props";

import ReportLinks from "./index";

storiesOf("ReportLinks", module)
  .add("default", () => {
    const reportLinks = report_link_all;
    return <ReportLinks {...{ currentReportType, reportLinks }} />;
  })
  .add("No Campaign/Marketing", () => {
    const reportLinks = report_link_no_campaign_market;
    return <ReportLinks {...{ currentReportType, reportLinks }} />;
  });
