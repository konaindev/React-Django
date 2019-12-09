import React from "react";

import { withState } from "@dump247/storybook-state";
import { storiesOf } from "@storybook/react";

import AddTagInput from "./index";

storiesOf("AddTagInput", module).add(
  "default",
  withState({ value: "" })(({ store }) => (
    <AddTagInput
      value={store.state.value}
      onChange={e => {
        store.set({ value: e.target.value });
      }}
    />
  ))
);
