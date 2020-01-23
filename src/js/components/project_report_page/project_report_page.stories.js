import React from "react";
import { storiesOf } from "@storybook/react";

import ProjectReportPage from "./index";
import { performanceProps } from "./props";

storiesOf("ProjectReportPage", module).add("Performance Report", () => (
  <ProjectReportPage {...performanceProps} />
));
