import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { storiesOf } from "@storybook/react";

import CreatePasswordView from "./index";
import { props } from "./props";

const _ = x => createStore(() => ({ createPassword: x }));

storiesOf("CreatePasswordView", module).add("default", () => (
  <Provider store={_(props)}>
    <CreatePasswordView />
  </Provider>
));
