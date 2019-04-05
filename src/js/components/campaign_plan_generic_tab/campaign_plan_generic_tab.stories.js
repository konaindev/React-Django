import React from "react";

import { storiesOf } from "@storybook/react";

import props from "../campaign_plan/campaign_plan.props";
import CampaignPlanGenericTab from "./index";

const tab1 = "demand_creation",
  tab2 = "market_intelligence",
  tab3 = "reputation_building",
  tab4 = "leasing_enablement";

storiesOf("CampaignPlanGenericTab", module)
  .add("Demand Creation", () => (
    <div style={{ margin: "16px auto" }}>
      <CampaignPlanGenericTab {...props[tab1]} tabKey={tab1} />
    </div>
  ))
  .add("Market Intelligence", () => (
    <div style={{ margin: "16px auto" }}>
      <CampaignPlanGenericTab {...props[tab2]} tabKey={tab2} />
    </div>
  ))
  .add("Reputation Building", () => (
    <div style={{ margin: "16px auto" }}>
      <CampaignPlanGenericTab {...props[tab3]} tabKey={tab3} />
    </div>
  ))
  .add("Leasing Enablement", () => (
    <div style={{ margin: "16px auto" }}>
      <CampaignPlanGenericTab {...props[tab4]} tabKey={tab4} />
    </div>
  ));
