import React from "react";

import { storiesOf } from "@storybook/react";

import props from "./campaign_plan_overview_tab.props";
import CampaignPlanOverviewTab from "./index";

storiesOf("CampaignPlanOverviewTab", module).add("default", () => (
  <div style={{ margin: "16px auto" }}>
    <CampaignPlanOverviewTab {...props} />
  </div>
));
