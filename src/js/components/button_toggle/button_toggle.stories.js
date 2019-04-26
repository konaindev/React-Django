import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { withState } from "@dump247/storybook-state";

import { StorybookContainer } from "../../utils/storybook-helper.stories";
import ButtonToggle from "./index";

storiesOf("ButtonToggle", module)
  .add(
    "default",
    withState({ checked: false })(({ store }) => (
      <StorybookContainer>
        <ButtonToggle
          checked={store.state.checked}
          onChange={checked => {
            store.set({ checked });
            action("onChange")(checked);
          }}
        />
      </StorybookContainer>
    ))
  )
  .add(
    "with custom labels",
    withState({ checked: false })(({ store }) => (
      <StorybookContainer>
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
      </StorybookContainer>
    ))
  );
