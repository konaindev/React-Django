import React from "react";

import { storiesOf } from "@storybook/react";

import EstimatedMarketSizeOverview from "./index";

import props from "./props";

storiesOf("EstimatedMarketSizeOverview", module).add("default", () => (
  <div style={{ width: 1320, margin: "80px auto" }}>
    <EstimatedMarketSizeOverview {...props} />
  </div>
));
