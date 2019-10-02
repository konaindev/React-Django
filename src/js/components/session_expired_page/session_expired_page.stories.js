import React from "react";
import { Provider } from "react-redux";
import { storiesOf } from "@storybook/react";

import _store from "../../state/store";
import SessionExpiredPage from "./index";

storiesOf("SessionExpiredPage", module).add("default", () => (
  <Provider store={_store}>
    <SessionExpiredPage />
  </Provider>
));
