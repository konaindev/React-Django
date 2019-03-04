import React from 'react';

 import { storiesOf } from '@storybook/react';

import props from './MarketAnalysis.js';
import TotalAddressableMarket from './index';

storiesOf('TotalAddressableMarket', module).add('default', () => (
  <div style={{ width: 1440, margin: '80px auto' }}>
    <TotalAddressableMarket {...props} />
  </div>
));
