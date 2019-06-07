import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { withState } from "@dump247/storybook-state";

import ToggleButton from "./index";
import { props } from "./props";

storiesOf("ToggleButton", module).add(
  "default",
  withState({ value: "list" })(({ store }) => (
    <ToggleButton
      {...props}
      value={store.state.value}
      onChange={value => {
        store.set({ value });
        action("onChange")(value);
      }}
    />
  ))
);
