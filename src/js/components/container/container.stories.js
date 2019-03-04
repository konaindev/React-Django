import React from 'react';

import { storiesOf } from '@storybook/react';

import Container from './index';

storiesOf('Container', module).add('default', () => (
  <Container>
    I'm inside {`<Container />`}.
  </Container>
));
