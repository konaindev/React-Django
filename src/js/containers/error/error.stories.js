import React from "react";
import { storiesOf } from "@storybook/react";

import { ErrorContainer } from "./index";
import props from "./props";

storiesOf("ErrorContainer", module).add("default", () => (
  <ErrorContainer {...props} />
));
