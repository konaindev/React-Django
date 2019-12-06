import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withState } from "@dump247/storybook-state";

import ButtonToggle from "./index";

storiesOf("ButtonToggle", module)
  .add(
    "default",
    withState({ checked: ButtonToggle.STATE_ENUM.CHECKED })(({ store }) => (
      <ButtonToggle
        checked={store.state.checked}
        onChange={checked => {
          store.set({ checked });
          action("onChange")(checked);
        }}
      />
    ))
  )
  .add(
    "with custom labels",
    withState({ checked: ButtonToggle.STATE_ENUM.UNCHECKED })(({ store }) => (
      <ButtonToggle
        checked={store.state.checked}
        innerLabelChecked="Checked"
        innerLabelUnchecked="Unchecked"
        label="Containing Label"
        onChange={checked => {
          store.set({ checked });
          action("onChange")(checked);
        }}
      />
    ))
  )
  .add("medium", () => (
    <ButtonToggle checked={ButtonToggle.STATE_ENUM.MEDIUM} />
  ));
