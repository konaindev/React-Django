import { configure } from "@storybook/react";
import "storybook-chromatic";
// automatically import all files ending in *.stories.js
const req = require.context("../src/js", true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
