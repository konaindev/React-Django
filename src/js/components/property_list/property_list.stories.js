import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import PropertyList from "./index";
import { props } from "./props";

storiesOf("PropertyList", module)
  .add("default", () => <PropertyList {...props} />)
  .add(
    "Selection mode",
    withState({ selected: [] })(({ store }) => (
      <PropertyList
        {...props}
        selectionMode={true}
        selectedProperties={store.state.selected}
        onSelect={selected => {
          store.set({ selected });
        }}
      />
    ))
  );
