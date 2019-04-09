import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { report_links } from "../project_page/project_page.stories.js";

import ReportLinks from "./index";

const current_report_name = "baseline";

export const props = { current_report_name, report_links };

storiesOf("ReportLinks", module).add("default", () => (
  <ReportLinks {...props} />
));
