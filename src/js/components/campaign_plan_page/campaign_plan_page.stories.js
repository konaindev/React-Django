import React from "react";

import { storiesOf } from "@storybook/react";

import { project, report_links } from "../project_page/props";
import campaignPlanProps from "../campaign_plan/campaign_plan.props";

import CampaignPlanPage from "./index";

const current_report_link = report_links.market;
const report = campaignPlanProps;
const props = { project, report, report_links, current_report_link };

storiesOf("CampaignPlanPage", module).add("default", () => (
  <CampaignPlanPage {...props} />
));
