import React from 'react';

import { storiesOf } from '@storybook/react';

import AgeRangePopulationSize from './index';
import '../../../../dist/main.postcss.css'; // @FIXME

const props = {
  age_group: '18-24',
  market_size: 2794,
  segment_population: 10369,
};

storiesOf('AgeRangePopulationSize', module).add('default', () => (
  <div style={{ width: 160, margin: '80px auto' }}>
    <AgeRangePopulationSize {...props} />
  </div>
));
