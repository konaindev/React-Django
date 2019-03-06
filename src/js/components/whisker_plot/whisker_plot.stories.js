import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import WhiskerPlot from "./index";

const props1 = {
  series: [1, 2, 3, 4, 5, 4, 3, 3, 1],
  direction: "up"
};

const props2 = {
  series: [3, 5, 2, 4, 5, 4, 1, 3, 1],
  direction: "down"
};

storiesOf("WhiskerPlot", module)
  .add("up", () => <WhiskerPlot {...props1} />)
  .add("down", () => <WhiskerPlot {...props2} />);
