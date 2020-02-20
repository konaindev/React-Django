import React from "react";
import { storiesOf } from "@storybook/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import ErrorContainer from "./index";
import props from "./props";

const storeObject = {
  nav: { navLinks: null },
  dashboard: {}
};
const tempStore = createStore(() => storeObject);

storiesOf("ErrorContainer", module).add("default", () => (
  <Provider store={tempStore}>
    <ErrorContainer {...props} />
  </Provider>
));
