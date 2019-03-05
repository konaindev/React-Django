import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import ReportSection from "./index";

const props = {
  name: "Test Name",
  horizontalPadding: true
};

storiesOf("ReportSection", module).add("default", () => (
  <ReportSection {...props} />
));
