import React from "react";
import { storiesOf } from "@storybook/react";

import KPICard, { NoTargetKPICard, NoValueKPICard } from "./index";
import { offTrack, atRisk, onTrack, NoTargetCard, NoValueCard } from "./props";

storiesOf("KPICard", module)
  .add("Off Track", () => <KPICard {...offTrack} />)
  .add("At Risk", () => <KPICard {...atRisk} />)
  .add("On Track", () => <KPICard {...onTrack} />)
  .add("No value card", () => <NoValueKPICard {...NoValueCard} />)
  .add("No target card", () => <NoTargetKPICard {...NoTargetCard} />);
