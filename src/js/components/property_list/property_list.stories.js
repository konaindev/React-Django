import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import PropertyList from "./index";
import { props } from "./props";

storiesOf("PropertyList", module).add(
  "default",
  withState({ selected: [] })(({ store }) => (
    <PropertyList
      {...props}
      selectedProperties={store.state.selected}
      onSelect={selected => {
        store.set({ selected });
      }}
    />
  ))
);
