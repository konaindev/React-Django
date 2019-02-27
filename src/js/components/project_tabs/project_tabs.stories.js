
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import ProjectTabs from './index';

const props = {
  report: {
    
  }
};

storiesOf('ProjectTabs', module).add('default', () => <ProjectTabs {...props} />);
