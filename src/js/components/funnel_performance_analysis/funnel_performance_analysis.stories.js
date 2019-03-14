import React from "react";

import { storiesOf } from "@storybook/react";

import props from "./FunnelProps";
import FunnelPerformanceAnalysis from "./index";

storiesOf("FunnelPerformanceAnalysis", module).add("default", () => (
  <div style={{ margin: "16px auto" }}>
    <FunnelPerformanceAnalysis funnelHistory={props.funnel_history} />
  </div>
));
