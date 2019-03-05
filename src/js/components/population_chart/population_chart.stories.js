import React from "react";

import { storiesOf } from "@storybook/react";
import PopulationChart from "./index";

const props = {
  segment_population: 10368,
  group_population: 3188
};

storiesOf("PopulationChart", module).add("default", () => (
  <div style={{ width: 400, margin: "0 auto" }}>
    <PopulationChart {...props} />
  </div>
));
