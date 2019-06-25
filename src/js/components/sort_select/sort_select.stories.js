import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import SortSelect from "./index";
import { props } from "./props";

storiesOf("SortSelect", module).add(
  "default",
  withState({ direction: "asc" })(({ store }) => (
    <div style={{ width: 300 }}>
      <SortSelect
        {...props}
        direction={store.state.direction}
        value={store.state.value}
        onChange={(value, direction) => store.set({ value, direction })}
      />
    </div>
  ))
);
