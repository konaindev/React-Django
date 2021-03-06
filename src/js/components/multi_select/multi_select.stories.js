import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import MultiSelect from "./index";
import { props, propsLong, propsScroll } from "./props";

storiesOf("MultiSelect", module)
  .add(
    "default",
    withState({ values: [] })(({ store }) => (
      <MultiSelect
        {...props}
        value={store.state.values}
        selectAllLabel="ALL"
        onChange={options => store.set({ values: options })}
      />
    ))
  )
  .add(
    "selected",
    withState({ values: props.options[1] })(({ store }) => (
      <MultiSelect
        {...props}
        value={store.state.values}
        selectAllLabel="ALL"
        onChange={options => store.set({ values: options })}
      />
    ))
  )
  .add(
    "scroll",
    withState({ values: [] })(({ store }) => (
      <MultiSelect
        {...propsScroll}
        value={store.state.values}
        onChange={options => store.set({ values: options })}
      />
    ))
  )
  .add(
    "long text",
    withState({ values: [] })(({ store }) => (
      <MultiSelect
        {...propsLong}
        value={store.state.values}
        onChange={options => store.set({ values: options })}
      />
    ))
  )
  .add(
    "highlight",
    withState({ values: [] })(({ store }) => (
      <MultiSelect
        {...props}
        theme="highlight"
        isShowControls={false}
        isShowAllOption={false}
        value={store.state.values}
        label={store.state.values?.map(v => v.label).join(", ")}
        onChange={options => store.set({ values: options })}
      />
    ))
  )
  .add(
    "gray",
    withState({ values: [] })(({ store }) => (
      <MultiSelect
        {...props}
        theme="gray"
        isShowControls={false}
        isShowAllOption={false}
        value={store.state.values}
        label={store.state.values?.map(v => v.label).join(", ")}
        onChange={options => store.set({ values: options })}
      />
    ))
  );
