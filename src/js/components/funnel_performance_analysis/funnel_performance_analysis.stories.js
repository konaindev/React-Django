import React from "react";

import { storiesOf } from "@storybook/react";

import Container from "../container";
import props from "./FunnelProps";
import FunnelPerformanceAnalysis from "./index";

storiesOf("FunnelPerformanceAnalysis", module)
  .add("default", () => (
    <div style={{ margin: "16px auto" }}>
      <Container>
        <FunnelPerformanceAnalysis {...props} />
      </Container>
    </div>
  ))
  .add("no data", () => (
    <div style={{ margin: "16px auto" }}>
      <Container>
        <FunnelPerformanceAnalysis funnel_history={null} />
      </Container>
    </div>
  ));
