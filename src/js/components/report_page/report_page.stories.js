
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import ReportPage from './index';

const props = {
  report: {

  }
};

storiesOf('ReportPage', module).add('default', () => <ReportPage {...props} />);
