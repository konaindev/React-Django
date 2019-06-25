import React from "react";
import { storiesOf } from "@storybook/react";

import TopNavigation from "./index";
import { props } from "./props";

storiesOf("TopNavigation", module).add("default", () => (
  <TopNavigation {...props} />
));
