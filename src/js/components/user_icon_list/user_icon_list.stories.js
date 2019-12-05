import React from "react";
import { storiesOf } from "@storybook/react";

import UserIconList from "./index";
import { props } from "./props";

const containerStyle = { padding: "100px", background: "#262F38" };

storiesOf("UserIconList", module)
  .add("default", () => (
    <div style={containerStyle}>
      <UserIconList style={{ borderColor: "#262F38" }} {...props} />
    </div>
  ))
  .add("project theme", () => (
    <div style={containerStyle}>
      <UserIconList theme="project" {...props} />
    </div>
  ));
