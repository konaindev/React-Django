import React, { Fragment } from 'react';

 import { storiesOf } from '@storybook/react';

 import MarketSizeMap from './index';

 const props_radius = {
  center: {
    type: "Point",
    coordinates: [45.5202471, -122.6741949]
  },
  radius: 3.1,
  units: "mi" // both miles and kilometers should be supported
};

const props_zips = {
  zip_codes: [
    {
      zip: "20910",
      outline: {
        type: "Polygon",
        coordinates: [
          [45.52, 122.68194444],
          [45.72, 122.68194444],
          [45.72, 122.78194444],
          [45.62, 122.78194444]
        ]
      }
    }
  ]
};

storiesOf('MarketSizeMap', module).add('default', () => (
  <Fragment>
    <div style={{ width: 870, margin: '80px auto' }}>
      <MarketSizeMap {...props_radius} />
    </div>
    <div style={{ width: 870, margin: '80px auto' }}>
      <MarketSizeMap {...props_zips} />
    </div>
  </Fragment>
));
