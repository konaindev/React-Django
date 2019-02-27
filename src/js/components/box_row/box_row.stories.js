
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import BoxRow from './index';

storiesOf('BoxRow', module).add('default', () => <BoxRow><div>1</div><div>2</div><div>3</div></BoxRow>);
