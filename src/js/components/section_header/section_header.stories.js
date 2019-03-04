import React from 'react';

import { storiesOf } from '@storybook/react';

import { SectionHeader } from './index';

const props = {
  title: 'ACQUISITION Funnel'
};

storiesOf('SectionHeader', module).add('default', () => <SectionHeader {...props} />);

storiesOf('SectionHeader', module).add('with right-side content', () => (
  <SectionHeader {...props}>
    <div>Any thing can come here</div>
  </SectionHeader>
));