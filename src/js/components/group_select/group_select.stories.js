import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import GroupSelect from "./index";
import { props } from "./props";

storiesOf("GroupSelect", module).add(
  "default",
  withState({ values: [] })(({ store }) => (
    <GroupSelect
      {...props}
      value={store.state.values}
      onChange={options => store.set({ values: options })}
    />
  ))
);
