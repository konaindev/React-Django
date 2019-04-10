import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import CampaignInvestmentReport from "./index";
import {
  props_baseline,
  props_performance,
  props_negative_performance
} from "./props";

storiesOf("CampaignInvestmentReport", module).add("baseline", () => (
  <CampaignInvestmentReport {...props_baseline} />
));

storiesOf("CampaignInvestmentReport", module).add("performance", () => (
  <CampaignInvestmentReport {...props_performance} />
));

storiesOf("CampaignInvestmentReport", module).add(
  "negative performance",
  () => <CampaignInvestmentReport {...props_negative_performance} />
);
