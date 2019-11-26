import React from "react";

import { storiesOf } from "@storybook/react";

import Container from "../container";
import AcquisitionFunnelReport from "./index";
import { props_baseline, props_performance } from "./props";

storiesOf("AcquisitionFunnelReport", module).add("baseline", () => (
  <Container>
    <AcquisitionFunnelReport {...props_baseline} />
  </Container>
));

storiesOf("AcquisitionFunnelReport", module).add("performance", () => (
  <Container>
    <AcquisitionFunnelReport {...props_performance} />
  </Container>
));
