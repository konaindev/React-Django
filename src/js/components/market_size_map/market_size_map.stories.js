import React from "react";

import { storiesOf } from "@storybook/react";

import MarketSizeMap from "./index";

export const props_radius = {
  center: {
    type: "Point",
    coordinates: [45.52, -122.68194444]
  },
  radius: 3.1,
  units: "mi" // both miles and kilometers should be supported
};

export const props_zips_polygon = {
  zip_codes: [
    {
      zip: "97201",
      outline: {
        type: "Polygon",
        coordinates: [
          [
            [45.476042, -122.713058],
            [45.520582, -122.720757],
            [45.523881, -122.700411],
            [45.515083, -122.680616],
            [45.513983, -122.672918],
            [45.504635, -122.667419],
            [45.476042, -122.669619],
            [45.476042, -122.713058]
          ]
        ]
      }
    },
    {
      zip: "97232",
      outline: {
        type: "Polygon",
        coordinates: [
          [
            [45.522781, -122.619031],
            [45.522781, -122.66577],
            [45.534878, -122.666869],
            [45.534878, -122.62013],
            [45.522781, -122.619031]
          ]
        ]
      }
    },
    {
      zip: "97215",
      outline: {
        type: "Polygon",
        coordinates: [
          [
            [45.522781, -122.57889],
            [45.504635, -122.57889],
            [45.505185, -122.617931],
            [45.505185, -122.619031],
            [45.523331, -122.617381],
            [45.522781, -122.57889]
          ]
        ]
      }
    }
  ]
};

export const props_zips_multi_polygon = {
  zip_codes: [
    {
      zip: "20004",
      outline: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-77.031963, 38.897349],
              [-77.031955, 38.898317],
              [-77.031742, 38.898317],
              [-77.03078, 38.898311],
              [-77.029973, 38.898314],
              [-77.02962, 38.898313],
              [-77.029619, 38.89791],
              [-77.029619, 38.897339],
              [-77.029693, 38.897339],
              [-77.029972, 38.89735],
              [-77.030646, 38.897346],
              [-77.031534, 38.89735],
              [-77.031743, 38.897349],
              [-77.031963, 38.897349]
            ]
          ]
        ]
      }
    }
  ]
};

storiesOf("MarketSizeMap", module)
  .add("circle with radius", () => (
    <div style={{ width: 870, height: 452, margin: "80px auto" }}>
      <MarketSizeMap {...props_radius} />
    </div>
  ))
  .add("zip code with polygons", () => (
    <div style={{ width: 870, height: 452, margin: "80px auto" }}>
      <MarketSizeMap {...props_zips_polygon} />
    </div>
  ))
  .add("zip code with multi polygons", () => (
    <div style={{ width: 870, height: 452, margin: "80px auto" }}>
      <MarketSizeMap {...props_zips_multi_polygon} />
    </div>
  ));
