import React from "react";

import { storiesOf } from "@storybook/react";

import EstimatedPopulation from "./index";

const props_radius = { population: 120448, radius: 3.1, units: "mi" };
const props_zips = { population: 120448, zip_codes: ["20910", "20911", "20912"] };

storiesOf('EstimatedPopulation', module).add('default', () => (
  <div style={{ height: 452, width: 420, display: 'flex', padding: 15 }}>
    <EstimatedPopulation {...props_radius} />
  </div>
));

storiesOf('EstimatedPopulation', module).add('zip_codes', () => (
  <div style={{ height: 452, width: 420, display: 'flex', padding: 15 }}>
    <EstimatedPopulation {...props_zips} />
  </div>
));