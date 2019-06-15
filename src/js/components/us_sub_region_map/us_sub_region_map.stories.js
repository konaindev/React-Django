import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withState } from "@dump247/storybook-state";

import USSubRegionMap from "./index";
import { west, midwest, south, northEast } from "./props";

storiesOf("USSubRegionMap", module)
  .add(
    "West",
    withState({ excludedStates: west.excludedStates })(({ store }) => (
      <USSubRegionMap
        {...west}
        excludedStates={store.state.excludedStates}
        onExcludeState={usState => {
          const excludedStates = [...store.state.excludedStates, usState];
          store.set({ excludedStates });
          action("onExcludeState")(usState);
        }}
        onIncludeState={usState => {
          const excludedStates = store.state.excludedStates.filter(
            s => s !== usState
          );
          store.set({ excludedStates });
          action("onIncludeState")(usState);
        }}
      />
    ))
  )
  .add(
    "Midwest",
    withState({ excludedStates: midwest.excludedStates })(({ store }) => (
      <USSubRegionMap
        {...midwest}
        excludedStates={store.state.excludedStates}
        onExcludeState={usState => {
          const excludedStates = [...store.state.excludedStates, usState];
          store.set({ excludedStates });
          action("onExcludeState")(usState);
        }}
        onIncludeState={usState => {
          const excludedStates = store.state.excludedStates.filter(
            s => s !== usState
          );
          store.set({ excludedStates });
          action("onIncludeState")(usState);
        }}
      />
    ))
  )
  .add(
    "South",
    withState({ excludedStates: south.excludedStates })(({ store }) => (
      <USSubRegionMap
        {...south}
        excludedStates={store.state.excludedStates}
        onExcludeState={usState => {
          const excludedStates = [...store.state.excludedStates, usState];
          store.set({ excludedStates });
          action("onExcludeState")(usState);
        }}
        onIncludeState={usState => {
          const excludedStates = store.state.excludedStates.filter(
            s => s !== usState
          );
          store.set({ excludedStates });
          action("onIncludeState")(usState);
        }}
      />
    ))
  )
  .add(
    "North East",
    withState({ excludedStates: northEast.excludedStates })(({ store }) => (
      <USSubRegionMap
        {...northEast}
        excludedStates={store.state.excludedStates}
        onExcludeState={usState => {
          const excludedStates = [...store.state.excludedStates, usState];
          store.set({ excludedStates });
          action("onExcludeState")(usState);
        }}
        onIncludeState={usState => {
          const excludedStates = store.state.excludedStates.filter(
            s => s !== usState
          );
          store.set({ excludedStates });
          action("onIncludeState")(usState);
        }}
      />
    ))
  );
