import React from "react";
import { storiesOf } from "@storybook/react";
import { createStore } from "redux";
import { Provider } from "react-redux";

import AddressModal from "./index";
import props from "./props";

storiesOf("AddressModal", module)
  .add("gray theme", () => (
    <Provider store={createStore(() => ({ addressModal: props }))}>
      <AddressModal {...props} theme="gray" />
    </Provider>
  ))
  .add("highlight theme", () => (
    <Provider store={createStore(() => ({ addressModal: props }))}>
      <AddressModal {...props} theme="highlight" />
    </Provider>
  ));
