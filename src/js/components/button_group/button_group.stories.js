import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { withState } from "@dump247/storybook-state";

import ButtonGroup from "./index";

const props = {
  value: "investment-driven",
  options: [
    {
      value: "schedule-driven",
      label: "Schedule Driven"
    },
    {
      value: "investment-driven",
      label: "Investment Driven"
    },
    {
      value: "run-rate",
      label: "Run Rate"
    },
    {
      value: "compare-models",
      label: "Compare Models"
    }
  ]
};

storiesOf("ButtonGroup", module).add(
  "default",
  withState({ value: "investment-driven" })(({ store }) => (
    <ButtonGroup
      {...props}
      value={store.state.value}
      onChange={value => {
        store.set({ value });
        action("onChange")(value);
      }}
    />
  ))
);
