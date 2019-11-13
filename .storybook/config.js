import "storybook-chromatic";
import React from "react";
import { configure, addDecorator } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";

import StorybookContainer from "../src/js/utils/storybook_helper";

// global decorators
// - wrap Link in react-router
// - wrap every story in the app container
addDecorator(storyFn => (
  <MemoryRouter initialEntries={["/"]}>
    <StorybookContainer>
      {storyFn()}
    </StorybookContainer>
  </MemoryRouter>
));

// automatically import all files ending in *.stories.js
const req = require.context("../src/js", true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
