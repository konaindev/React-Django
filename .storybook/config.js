import React from "react";
import { configure, addDecorator } from "@storybook/react";
import "storybook-chromatic";

import StorybookContainer from "../src/js/utils/storybook_helper";

// global decorator which centers every story in the storybook
addDecorator(storyFn => <StorybookContainer>{storyFn()}</StorybookContainer>);

// automatically import all files ending in *.stories.js
const req = require.context("../src/js", true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
