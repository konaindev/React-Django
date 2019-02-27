import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import MarketSizeByIncome from './index';
import '../../../../dist/main.css'; // TODO: imported for loading fonts in storybook

const props = {
  income: "75000.00",
  segment_population: 10368,
  group_population: 3188,
  home_owners: {
    total: 249,
    family: 123,
    nonfamily: 126
  },
  renters: {
    total: 2940,
    family: 459,
    nonfamily: 2481
  },
  market_size: 2481,
  active_populations: ["renters.nonfamily"]
};

storiesOf('MarketSizeByIncome', module).add('default', () => (
  <div style={{ width: 400, margin: '0 auto' }}>
    <MarketSizeByIncome {...props} />
  </div>
));
