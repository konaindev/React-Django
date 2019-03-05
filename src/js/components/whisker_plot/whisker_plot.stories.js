import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import WhiskerPlot from "./index";

const props = {
  series: [1, 2, 3, 4, 5, 4, 3, 3, 1]
};

storiesOf("WhiskerPlot", module).add("default", () => (
  <WhiskerPlot {...props} />
));
