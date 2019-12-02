import React from "react";
import { storiesOf } from "@storybook/react";

import EstimatedPopulation from "./index";
import { props_radius, props_zips } from "./props";

storiesOf("EstimatedPopulation", module).add("circle with radius", () => (
  <div style={{ width: 1320, margin: "80px auto" }}>
    <EstimatedPopulation {...props_radius} />
  </div>
));

storiesOf("EstimatedPopulation", module).add("zip code polygons", () => (
  <div style={{ width: 1320, margin: "80px auto" }}>
    <EstimatedPopulation {...props_zips} />
  </div>
));
