import React from "react";

import { storiesOf } from "@storybook/react";

import ModelingReportPage from "./index";

const props = {};

storiesOf("ModelingReportPage", module).add("default", () => (
  <ModelingReportPage {...props} />
));
