import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import BaselineComparisonMatrix from "./index";
import { props, one_competitor_props, no_competitor_props } from "./props";

storiesOf("BaselineComparisonMatrix", module)
  .add("default", () => <BaselineComparisonMatrix {...props} />)
  .add("One Competitor", () => (
    <BaselineComparisonMatrix {...one_competitor_props} />
  ))
  .add("No Competitors", () => (
    <BaselineComparisonMatrix {...no_competitor_props} />
  ));
