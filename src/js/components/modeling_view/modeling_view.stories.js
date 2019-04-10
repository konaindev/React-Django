import React from "react";
import { storiesOf } from "@storybook/react";

import ModelingView from "./index";
import { props } from "./props";

storiesOf("ModelingView", module).add("default", () => (
  <ModelingView {...props} />
));
