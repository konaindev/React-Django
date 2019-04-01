import React from "react";

import { storiesOf } from "@storybook/react";

import AgeRangePopulationSize from "./index";

const props = {
  age_group: "18-24",
  color: "#41C100",
  market_size: 2794,
  segment_population: 10369
};

storiesOf("AgeRangePopulationSize", module).add("default", () => (
  <div style={{ width: 360, margin: "80px auto" }}>
    <AgeRangePopulationSize {...props} />
  </div>
));
