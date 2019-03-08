import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import ReportSection from "./index";

const props1 = {
  name: "Test Name"
};

const props2 = {
  name: "Test Name",
  reportInfo: {
    name: "Schedule Driven",
    dates: {
      start: "2018-07-23",
      end: "2018-12-17"
    }
  }
};

storiesOf("ReportSection", module)
  .add("default", () => <ReportSection {...props1} />)
  .add("with report info", () => <ReportSection {...props2} />);
