import React from "react";

import { storiesOf } from "@storybook/react";

import MarketSizeMap from "./index";
import {
  circleOnly,
  zipcodesOnly,
  circleWithZipcodes,
  polygonWithHole
} from "./props";

storiesOf("MarketSizeMap", module)
  .add("Circle Only", () => (
    <div style={{ width: 870, height: 452, margin: "80px auto" }}>
      <MarketSizeMap {...circleOnly} />
    </div>
  ))
  .add("Zipcodes Only (Polygon and MultiPolygon)", () => (
    <div style={{ width: 870, height: 452, margin: "80px auto" }}>
      <MarketSizeMap {...zipcodesOnly} />
    </div>
  ))
  .add("Circle with zipcodes", () => (
    <div style={{ width: 870, height: 452, margin: "80px auto" }}>
      <MarketSizeMap {...circleWithZipcodes} />
    </div>
  ))
  .add("Polygon with holes", () => (
    <div style={{ width: 870, height: 452, margin: "80px auto" }}>
      <MarketSizeMap {...polygonWithHole} />
    </div>
  ));
