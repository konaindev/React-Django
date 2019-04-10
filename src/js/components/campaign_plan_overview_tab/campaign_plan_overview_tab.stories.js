import React from "react";

import { storiesOf } from "@storybook/react";

import CampaignPlanProps from "../campaign_plan/campaign_plan.props";
import CampaignPlanOverviewTab from "./index";

storiesOf("CampaignPlanOverviewTab", module).add("default", () => (
  <div style={{ margin: "16px auto" }}>
    <CampaignPlanOverviewTab {...CampaignPlanProps.overview} />
  </div>
));
