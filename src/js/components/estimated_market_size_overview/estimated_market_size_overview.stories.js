import React from 'react';

import { storiesOf } from '@storybook/react';

import EstimatedMarketSizeOverview from './index';
import '../../../../dist/main.postcss.css'; // @FIXME

const props = {
  market_sizes: [
    { age_group: "18-24", market_size: 2794, segment_population: 10369 },
    { age_group: "25-34", market_size: 9376, segment_population: 32219 },
    { age_group: "35-44", market_size: 3670, segment_population: 20033 },
    { age_group: "45-54", market_size: 3621, segment_population: 14257 },
    { age_group: "55-64", market_size: 3567, segment_population: 14782 },
    { age_group: "65+", market_size: 7312, segment_population: 15979 },
  ]
};

storiesOf('EstimatedMarketSizeOverview', module).add('default', () => (
  <div style={{ width: 1320, margin: '80px auto' }}>
    <EstimatedMarketSizeOverview {...props} />
  </div>
));
