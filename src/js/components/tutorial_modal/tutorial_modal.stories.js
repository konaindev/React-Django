import React from "react";
import { storiesOf } from "@storybook/react";

import TutorialModal from "./index";
import { props } from "./props";

storiesOf("TutorialModal", module).add("default", () => (
  <TutorialModal {...props} />
));
