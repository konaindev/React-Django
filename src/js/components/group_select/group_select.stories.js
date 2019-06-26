import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import GroupSelect from "./index";
import { props, propsOneGroup, propsScroll } from "./props";

storiesOf("GroupSelect", module)
  .add(
    "default",
    withState({ values: [] })(({ store }) => (
      <GroupSelect
        {...props}
        value={store.state.values}
        onChange={options => store.set({ values: options })}
      />
    ))
  )
  .add(
    "one group",
    withState({ values: [] })(({ store }) => (
      <GroupSelect
        {...propsOneGroup}
        value={store.state.values}
        onChange={options => store.set({ values: options })}
      />
    ))
  )
  .add(
    "scroll",
    withState({ values: [] })(({ store }) => (
      <GroupSelect
        {...propsScroll}
        value={store.state.values}
        onChange={options => store.set({ values: options })}
      />
    ))
  );
