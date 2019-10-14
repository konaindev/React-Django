import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import {
  current_report_name,
  report_link_all,
  report_link_no_campaign_market
} from "./props";

import ReportLinks from "./index";

storiesOf("ReportLinks", module)
  .add("default", () => {
    const report_links = report_link_all;
    return <ReportLinks {...{ current_report_name, report_links }} />;
  })
  .add("No Campaign/Marketing", () => {
    const report_links = report_link_no_campaign_market;
    return <ReportLinks {...{ current_report_name, report_links }} />;
  });
