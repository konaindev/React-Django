import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import CommonReport from "./index";
import { props_baseline, props_performance, props_date_span } from "./props";

storiesOf("CommonReport", module).add("baseline", () => (
  <CommonReport {...props_baseline} />
));

storiesOf("CommonReport", module).add("performance", () => (
  <CommonReport {...props_performance} />
));

storiesOf("CommonReport", module).add("with date span", () => (
  <CommonReport {...props_date_span} />
));
