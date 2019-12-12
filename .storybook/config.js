import "storybook-chromatic";
import React from "react";
import { configure, addDecorator } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import StorybookContainer from "../src/js/utils/storybook_helper";

const store = createStore(() => ({}));

// global decorators
// - wrap Link in react-router
// - wrap every story in the app container
addDecorator(storyFn => (
  <Provider store={store}>
    <MemoryRouter initialEntries={["/"]}>
      <StorybookContainer>{storyFn()}</StorybookContainer>
    </MemoryRouter>
  </Provider>
));

// automatically import all files ending in *.stories.js
const req = require.context("../src/js", true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
