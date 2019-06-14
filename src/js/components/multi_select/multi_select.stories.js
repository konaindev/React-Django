import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import MultiSelect from "./index";
import { props, propsLong } from "./props";

storiesOf("MultiSelect", module)
  .add("default", () => <MultiSelect {...props} />)
  .add("selected", () => (
    <MultiSelect {...props} value={props.options[1]} menuIsOpen />
  ))
  .add(
    "all selected",
    withState({ values: [] })(({ store }) => (
      <MultiSelect
        {...props}
        value={store.state.values}
        selectAllLabel="ALL"
        onChange={options => store.set({ values: options })}
      />
    ))
  )
  .add("long text", () => <MultiSelect {...propsLong} menuIsOpen />);
