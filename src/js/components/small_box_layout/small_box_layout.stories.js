import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { SmallBoxLayout } from './index';

const props = {
  name: 'Test name',
  content: 'Test content',
  detail: 'This is details',
};

storiesOf('SmallBoxLayout', module).add('default', () => <SmallBoxLayout {...props} />);
