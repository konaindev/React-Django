import React from "react";

import { storiesOf } from "@storybook/react";

import { props as report } from "../modeling_view/modeling_view.stories.js";
import { project, report_links } from "../project_page/project_page.stories.js";

import ModelingReportPage from "./index";

const current_report_link = report_links.modeling;

const props = { project, report, report_links, current_report_link };

console.log(props);

storiesOf("ModelingReportPage", module).add("default", () => (
  <ModelingReportPage {...props} />
));
