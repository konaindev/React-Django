import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { LargeBoxLayout } from "./index";

const props = {
  name: "Test name",
  content: "Test content",
  detail: "This is details",
  detail2: "This is more details",
  innerBox: null
};

storiesOf("LargeBoxLayout", module).add("default", () => (
  <LargeBoxLayout {...props} />
));
