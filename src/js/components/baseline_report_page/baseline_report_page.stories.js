import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import BaselineReportPage from "./index";
import { props } from "./props";

storiesOf("BaselineReportPage", module).add("default", () => (
  <BaselineReportPage {...props} />
));
