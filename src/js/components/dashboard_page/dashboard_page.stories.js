import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";
import { action } from "@storybook/addon-actions";
import { Provider } from "react-redux";

import { apiMock as inviteModalApiMock } from "../invite_modal/invite_modal.stories";
import store from "../../state/store";

import DashboardPage from "./index";
import { props } from "./props";

const _store = store;
document.cookie = "isLogin=true";

storiesOf("DashboardPage", module)
  .addDecorator(inviteModalApiMock)
  .addDecorator(story => {
    _store.dispatch({
      type: "INVITE_MODAL_HIDE"
    });
    store.getState().general = { ...props, selectedProperties: [] };
    return story();
  })
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
