import React from "react";

import { storiesOf } from "@storybook/react";

import CampaignPlan from "./index";
import CampaignPlanProps from "./campaign_plan.props";

storiesOf("CampaignPlan", module).add("base", () => (
  <CampaignPlan {...CampaignPlanProps} />
));
