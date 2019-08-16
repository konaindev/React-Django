import React from "react";
import { storiesOf } from "@storybook/react";

import WizardProgress from "./index";
import { steps } from "./props";

storiesOf("WizardProgress", module).add("default", () => (
  <WizardProgress steps={steps} />
));
