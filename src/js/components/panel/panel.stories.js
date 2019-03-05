import React from "react";

import { storiesOf } from "@storybook/react";

import Panel from "./index";

storiesOf("Panel", module).add("default", () => (
  <Panel style={{ padding: 30 }}>
    Any contents here, any props can be assigned.
    <br />
    e.g. <br />
    style={`{{ padding: 30}}`}
    <br />
    className="my-panel"
    <br />
    component={`{MyComponent}`}
  </Panel>
));
