import React from "react";
import { storiesOf } from "@storybook/react";
import { Provider } from "react-redux";

import { apiMock as inviteModalApiMock } from "../invite_modal/invite_modal.stories";
import storeFunc from "../../redux_base/store";

import DashboardPage from "./index";
import { props } from "./props";

const { store } = storeFunc();
document.cookie = "isLogin=true";

storiesOf("DashboardPage", module)
  .addDecorator(inviteModalApiMock)
  .add("default", () => (
    <Provider store={store}>
      <DashboardPage {...props} />
    </Provider>
  ))
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
