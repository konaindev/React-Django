import React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import TabNavigator, { Tab } from "./index";

storiesOf("TabNavigator", module).add(
  "default",
  withState({ selectedIndex: 0 })(({ store }) => (
    <TabNavigator
      selectedIndex={store.state.selectedIndex}
      onChange={index => {
        store.set({ selectedIndex: index });
        action("tabChange")(index);
      }}
    >
      <Tab label="Run Rate Model">
        <div>Tab 1 Content here</div>
        <div>This should not render unless it is the selected tab.</div>
      </Tab>
      <Tab label="Deadline-Driven Model">
        <div>Tab 2 Content here</div>
      </Tab>
    </TabNavigator>
  ))
);
