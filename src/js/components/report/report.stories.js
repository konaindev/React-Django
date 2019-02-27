
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Report from './index';

const props = {
  report: {

  }
};

storiesOf('Report', module).add('default', () => <Report {...props} />);
