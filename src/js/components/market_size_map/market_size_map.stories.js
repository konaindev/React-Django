import React from 'react';

 import { storiesOf } from '@storybook/react';

 import MarketSizeMap from './index';

 const props_radius = {
  center: {
    type: "Point",
    coordinates: [45.52, -122.68194444]
  },
  radius: 3.1,
  units: "mi" // both miles and kilometers should be supported
};

const props_zips = {
  zip_codes: [
    {
      zip: "97201",
      outline: {
        type: "Polygon",
        coordinates: [
          [45.476042, -122.713058],
          [45.520582, -122.720757],
          [45.523881, -122.700411],
          [45.515083, -122.680616],
          [45.513983, -122.672918],
          [45.504635, -122.667419],
          [45.476042, -122.669619],
          [45.476042, -122.713058],
        ]
      }
    },
    {
      zip: "97232",
      outline: {
        type: "Polygon",
        coordinates: [
          [45.522781, -122.619031],
          [45.522781, -122.66577],
          [45.534878, -122.666869],
          [45.534878, -122.62013],
          [45.522781, -122.619031],
        ]
      }
    },
    {
      zip: "97215",
      outline: {
        type: "Polygon",
        coordinates: [
          [45.522781, -122.57889],
          [45.504635, -122.57889],
          [45.505185, -122.617931],
          [45.505185, -122.619031],
          [45.523331, -122.617381],
          [45.522781, -122.57889],
        ]
      }
    }
  ]
};


storiesOf('MarketSizeMap', module)
  .add('circle with radius', () => (
    <div style={{ width: 870, margin: '80px auto' }}>
      <MarketSizeMap {...props_radius} />
    </div>
  ))
  .add('zip code polygons', () => (
    <div style={{ width: 870, margin: '80px auto' }}>
      <MarketSizeMap {...props_zips} />
    </div>
  ))
