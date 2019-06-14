import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import SortSelect from "./index";
import { props } from "./props";

storiesOf("SortSelect", module).add(
  "default",
  withState({ isReverse: false })(({ store }) => (
    <SortSelect
      {...props}
      isReverse={store.state.isReverse}
      onReverse={isReverse => store.set({ isReverse })}
    />
  ))
);
