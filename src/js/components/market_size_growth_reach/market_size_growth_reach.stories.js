import React from 'react';

 import { storiesOf } from '@storybook/react';

 import MarketSizeGrowthReach from './index';

 const props = {
  city: "Portland, OR",
  market_sizes: [
    {
      age_group: "18-24",
      market_size: 2794,
      usv: 3561,
      growth: -0.011,
      future_size: 2703
    },
    {
      age_group: "25-34",
      market_size: 9376,
      usv: 5949,
      growth: 0.037,
      future_size: 10456
    },
    {
      age_group: "35-44",
      market_size: 3670,
      usv: 4226,
      growth: 0.047,
      future_size: 4212
    },
    {
      age_group: "45-54",
      market_size: 3621,
      usv: 2973,
      growth: 0.005,
      future_size: 3676
    },
    {
      age_group: "55-64",
      market_size: 3567,
      usv: 2253,
      growth: 0.027,
      future_size: 3864
    },
    {
      age_group: "65+",
      market_size: 7312,
      usv: 659,
      growth: 0.0397,
      future_size: 8218
    }
  ],
  future_year: 2022,
  average: {
    age: 34,
    growth: 0.024
  },
  total: {
    market_size: 30340,
    usv: 19621,
    future_size: 33129
  }
};

storiesOf('MarketSizeGrowthReach', module).add('default', () => (
  <div style={{ width: 1320, margin: '80px auto' }}>
    <MarketSizeGrowthReach {...props} />
  </div>
));
