import React from "react";

import { storiesOf } from "@storybook/react";

import report from "../total_addressable_market/MarketAnalysis.js";
import { project, report_links } from "../project_page/project_page.stories.js";

import MarketReportPage from "./index";

const current_report_link = report_links.market;

const props = { project, report, report_links, current_report_link };

storiesOf("MarketReportPage", module).add("default", () => (
  <MarketReportPage {...props} />
));
