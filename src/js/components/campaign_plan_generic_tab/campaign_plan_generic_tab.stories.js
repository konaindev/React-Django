import React from "react";

import { storiesOf } from "@storybook/react";

import CampaignPlanProps from "../campaign_plan/campaign_plan.props";
import { GENERIC_TABS_ORDERED } from "../campaign_plan/campaign_plan.constants";
import CampaignPlanGenericTab from "./index";
import Container from "../container";

const story = storiesOf("CampaignPlanGenericTab", module);

GENERIC_TABS_ORDERED.map(([key, label]) => {
  story.add(label, () => (
    <div style={{ margin: "16px auto" }}>
      <Container>
        <CampaignPlanGenericTab {...CampaignPlanProps[key]} tabKey={key} />
      </Container>
    </div>
  ));
});
