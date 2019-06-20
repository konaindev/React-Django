import React from "react";

import { storiesOf } from "@storybook/react";

import props from "./props";
import ModelingReportPage from "./index";

storiesOf("ModelingReportPage", module).add("default", () => (
  <ModelingReportPage {...props} />
));
