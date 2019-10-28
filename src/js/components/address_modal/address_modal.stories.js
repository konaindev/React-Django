import React from "react";
import { storiesOf } from "@storybook/react";
import { createStore } from "redux";
import _store from "../../state/store";
import { Provider } from "react-redux";

import AddressModal from "./index";

const props = {
  isOpen: true,
  addresses: {
    suggested_address: {
      office_city: "Washington",
      office_state: "DC",
      office_street: "1600 Pennsylvania Ave NW",
      office_zip: "20500"
    },
    entered_address: {
      office_city: "Wsigo",
      office_state: "dc",
      office_street: "1600 penn av nw",
      office_zip: "20500"
    }
  }
};

storiesOf("AddressModal", module)
  .add("dark theme", () => (
    <Provider store={createStore(() => ({}))}>
      <AddressModal {...props} theme="dark" />
    </Provider>
  ))
  .add("light theme", () => (
    <Provider store={createStore(() => ({}))}>
      <AddressModal {...props} theme="light" />
    </Provider>
  ));
