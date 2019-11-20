import React from "react";
import { storiesOf } from "@storybook/react";
import { createStore } from "redux";
import { Provider } from "react-redux";

import CompleteAccountView from "./index";
import { props } from "./props";

const _ = x => createStore(() => ({ completeAccount: x, network: {} }));

storiesOf("CompleteAccountView", module).add("default", () => (
  <Provider store={_(props)}>
    <CompleteAccountView countView />
  </Provider>
));
