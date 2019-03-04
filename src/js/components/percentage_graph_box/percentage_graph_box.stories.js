import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import PercentageGraphBox from './index';

const props1 = {
  name: "USV > EXE",
  value: 0.1,
  target: 0.13,
  delta: 0.03,
  series: [10, 20, 30, 15],
};

const props2 = {
  name: "USV > EXE",
  value: 0.1,
  target: 0.13,
  delta: 0.03,
  extraContent: "227 Executed Leases (Out of 260)",
  series: [10, 20, 30, 15],
};

storiesOf('PercentageGraphBox', module)
  .add('default', () => (
    <div style={{ width: 420 }}>
      <PercentageGraphBox {...props1} />
    </div>
  ))
  .add('with extra content', () => (
    <div style={{ width: 420 }}>
      <PercentageGraphBox {...props2} />
    </div>
  ));
