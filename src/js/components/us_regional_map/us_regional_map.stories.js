import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withState } from "@dump247/storybook-state";

import USRegionalMap from "./index";
import { props } from "./props";

storiesOf("USRegionalMap", module)
  .add(
    "default",
    withState({ excludedRegions: [] })(({ store }) => (
      <div style={{ margin: "80px auto" }}>
        <USRegionalMap
          {...props}
          excludedRegions={store.state.excludedRegions}
          onExcludeRegion={region => {
            const excludedRegions = [...store.state.excludedRegions, region];
            store.set({ excludedRegions });
            action("onExcludeRegion")(region);
          }}
          onIncludeRegion={region => {
            const excludedRegions = store.state.excludedRegions.filter(
              r => r !== region
            );
            store.set({ excludedRegions });
            action("onIncludeRegion")(region);
          }}
        />
      </div>
    ))
  )
  .add(
    "Excluded West",
    withState({ excludedRegions: ["w"] })(({ store }) => (
      <div style={{ margin: "80px auto" }}>
        <USRegionalMap
          {...props}
          excludedRegions={store.state.excludedRegions}
          onExcludeRegion={region => {
            const excludedRegions = [...store.state.excludedRegions, region];
            store.set({ excludedRegions });
            action("onExcludeRegion")(region);
          }}
          onIncludeRegion={region => {
            const excludedRegions = store.state.excludedRegions.filter(
              r => r !== region
            );
            store.set({ excludedRegions });
            action("onIncludeRegion")(region);
          }}
        />
      </div>
    ))
  )
  .add("max size", () => (
    <USRegionalMap {...props} width="100%" height="100%" />
  ));
