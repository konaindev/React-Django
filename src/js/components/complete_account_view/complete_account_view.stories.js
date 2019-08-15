import React from "react";
import { storiesOf } from "@storybook/react";

import CompleteAccountView from "./index";
import { props } from "./props";

storiesOf("CompleteAccountView", module).add("default", () => (
  <CompleteAccountView {...props} />
));
