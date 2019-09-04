import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";
import { action } from "@storybook/addon-actions";
import { Provider } from "react-redux";

import store from "../../state/store";

import DashboardPage from "./index";
import { props } from "./props";

const _store = store;
document.cookie = "isLogin=true";

storiesOf("DashboardPage", module)
  .add(
    "default",
    withState({ filters: {} })(({ store }) => (
      <Provider store={_store}>
        <DashboardPage
          {...props}
          filters={store.state.filters}
          onChangeFilter={filters => {
            store.set({ filters });
            action("onChange")(filters);
          }}
        />
      </Provider>
    ))
  )
  .add("List view", () => (
    <Provider store={store}>
      <DashboardPage {...props} viewType="list" />
    </Provider>
  ))
  .add("List select", () => (
    <Provider store={store}>
      <DashboardPage
        {...props}
        viewType="list"
        selectedProperties={props.properties.slice(0, 1)}
      />
    </Provider>
  ));
