import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { storiesOf } from "@storybook/react";

import InviteModal from "./index";
import { props, multiProps } from "./props";

const _ = x =>
  createStore(() => ({
    inviteModal: x,
    general: {
      selectedProperties: x.properties
    }
  }));

storiesOf("InviteModal", module)
  .add("default", () => (
    <Provider store={_(props)}>
      <InviteModal />
    </Provider>
  ))
  .add("Multiple properties", () => (
    <Provider store={_(multiProps)}>
      <InviteModal />
    </Provider>
  ));
