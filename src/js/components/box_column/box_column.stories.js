
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import BoxColumn from './index';

storiesOf('BoxColumn', module).add('default', () => <BoxColumn><div>1</div><div>2</div><div>3</div></BoxColumn>);
