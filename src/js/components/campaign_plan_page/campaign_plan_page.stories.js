import React from "react";

import { storiesOf } from "@storybook/react";

import { CampaignPlanPage } from "./index";
import props from "./props";

storiesOf("CampaignPlanPage", module).add("default", () => (
  <CampaignPlanPage {...props} />
));
