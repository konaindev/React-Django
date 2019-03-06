import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import DeltaIndicator from "./index";

const props1 = {
  delta: 0.2,
  direction: 1,
  indicatorPos: "left"
};

const props2 = {
  delta: -0.5,
  direction: -1,
  indicatorPos: "right"
};

storiesOf("DeltaIndicator", module)
  .add("left indicator", () => <DeltaIndicator {...props1} />)
  .add("right indicator", () => <DeltaIndicator {...props2} />);
