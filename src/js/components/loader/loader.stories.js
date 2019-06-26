import React from "react";

import { storiesOf } from "@storybook/react";

import Loader from "./index";

const style = {
  width: "100%",
  height: "500px",
  margin: "auto",
  padding: "50px",
  backgroundColor: "rebeccapurple"
};

storiesOf("Loader", module).add("default", () => (
  <div style={style}>
    <div style={{ position: "relative", height: "400px" }}>
      <Loader isShow={true} />
    </div>
  </div>
));
