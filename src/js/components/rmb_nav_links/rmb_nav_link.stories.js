import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withState } from "@dump247/storybook-state";

import RmbNavLinks from "./index";
import { basicOptions, tooltipOptions } from "./props";

storiesOf("RmbNavLinks", module)
  .add(
    "basic options",
    withState({ value: basicOptions[0].value })(({ store }) => (
      <div style={{ borderBottom: "1px solid #2B343D" }}>
        <RmbNavLinks
          options={basicOptions}
          selected={store.state.value}
          onChange={value => {
            store.set({ value });
            action("onChange")(value);
          }}
        />
      </div>
    ))
  )
  .add(
    "with tooltips",
    withState({ value: tooltipOptions[0].value })(({ store }) => (
      <div style={{ borderBottom: "1px solid #2B343D", paddingTop: "20px" }}>
        <RmbNavLinks
          options={tooltipOptions}
          selected={store.state.value}
          onChange={value => {
            store.set({ value });
            action("onChange")(value);
          }}
        />
      </div>
    ))
  );
