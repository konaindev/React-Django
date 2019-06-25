import React from "react";
import { storiesOf } from "@storybook/react";

import KPICard from "./index";
import { offTrack, atRisk, onTrack } from "./props";

storiesOf("KPICard", module)
  .add("Off Track", () => <KPICard {...offTrack} />)
  .add("At Risk", () => <KPICard {...atRisk} />)
  .add("On Track", () => <KPICard {...onTrack} />);
