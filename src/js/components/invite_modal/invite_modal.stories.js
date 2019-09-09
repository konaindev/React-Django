import React from "react";
import { Provider } from "react-redux";
import { storiesOf } from "@storybook/react";

import _store from "../../state/store";

import InviteModal from "./index";
import { props, multiProps } from "./props";

storiesOf("InviteModal", module)
  .add("default", () => {
    _store.dispatch({
      type: "GENERAL_UPDATE_STATE",
      newState: { selectedProperties: props.properties }
    });
    return (
      <Provider store={_store}>
        <InviteModal {...props} />
      </Provider>
    );
  })
  .add("Multiple properties", () => {
    _store.dispatch({
      type: "GENERAL_UPDATE_STATE",
      newState: { selectedProperties: multiProps.properties }
    });
    return (
      <Provider store={_store}>
        <InviteModal {...multiProps} />
      </Provider>
    );
  });
