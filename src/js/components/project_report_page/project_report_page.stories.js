import React from "react";
import { storiesOf } from "@storybook/react";

import ProjectReportPage from "./index";
import { performanceProps, baselineProps } from "./props";

storiesOf("ProjectReportPage", module)
  .add("Performance Report", () => <ProjectReportPage {...performanceProps} />)
  .add("Baseline Report", () => <ProjectReportPage {...baselineProps} />);
