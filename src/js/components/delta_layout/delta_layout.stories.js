import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import DeltaLayout from "./index";

const props = {
  value: 50,
  delta: 2,
  direction: DeltaLayout.DIRECTION_UP
};

storiesOf("DeltaLayout", module).add("default", () => (
  <DeltaLayout {...props} />
));
