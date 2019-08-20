import React from "react";
import { storiesOf } from "@storybook/react";

import Input from "../input";
import Tooltip from "../rmb_tooltip";
import PasswordOverlay from "./index";
import { props } from "./props";

function TooltipInput(props) {
  const password = props.password || "";
  const theme = props.theme || "";
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff"
      }}
    >
      <div style={{ position: "absolute", top: "15%", left: "15%" }}>
        <Tooltip
          visible={true}
          placement="bottom"
          overlay={<PasswordOverlay {...props} />}
          theme={theme}
        >
          <Input type="text" placeholder="Text" defaultValue={password} />
        </Tooltip>
      </div>
    </div>
  );
}

storiesOf("PasswordTooltip", module)
  .add("default", () => <TooltipInput {...props} />)
  .add("success", () => <TooltipInput password="P@ssw0rd" {...props} />)
  .add("with errors", () => (
    <TooltipInput password="P@ss" errors={{ length: true }} {...props} />
  ))
  .add("highlight theme", () => <TooltipInput theme="highlight" {...props} />);
