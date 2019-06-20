import React from "react";

import { storiesOf } from "@storybook/react";

import { props as report } from "../modeling_view/props.js";
import { project, report_links } from "../project_page/props";

import ModelingReportPage from "./index";

const current_report_link = report_links.modeling;

const props = { project, report, report_links, current_report_link };

storiesOf("ModelingReportPage", module).add("default", () => (
  <ModelingReportPage {...props} />
));
